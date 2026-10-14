import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectHeader } from './components/ProjectHeader';
import { KanbanBoard } from './components/KanbanBoard';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { PHPReportModal } from './components/PHPReportModal';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import { Toast } from './components/Toast';

import { INITIAL_PROJECTS, INITIAL_TASKS, TEAM_MEMBERS } from './data/initialData';
import { 
  isSupabaseConfigured, 
  getSupabaseClient 
} from './lib/supabase';
import { 
  checkPhpServerStatus, 
  exportTasksAsCsv 
} from './services/reportService';

const STORAGE_KEY_TASKS = 'taskflow_local_tasks_v2';
const STORAGE_KEY_PROJECTS = 'taskflow_local_projects_v2';
const STORAGE_KEY_THEME = 'taskflow_theme';

export function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // Active view: 'board' or 'analytics'
  const [currentView, setCurrentView] = useState('board');

  // Core Data State
  const [projects, setProjects] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return cached ? JSON.parse(cached) : INITIAL_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState(() => projects[0] || INITIAL_PROJECTS[0]);

  const [tasks, setTasks] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY_TASKS);
    return cached ? JSON.parse(cached) : INITIAL_TASKS;
  });

  const [teamMembers] = useState(TEAM_MEMBERS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Backend Connectivity Status
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [isPhpLive, setIsPhpLive] = useState(false);

  // Modal Controls
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync theme with body class
  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync local data to localStorage as offline fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  // Check Supabase and PHP connectivity on load
  const verifyBackendServices = useCallback(async () => {
    // 1. Check PHP server
    const phpRes = await checkPhpServerStatus();
    setIsPhpLive(phpRes.online);

    // 2. Check Supabase
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: dbProjects, error: pError } = await client.from('projects').select('*');
          if (!pError && dbProjects && dbProjects.length > 0) {
            setProjects(dbProjects);
            setActiveProject(dbProjects[0]);
            setIsSupabaseLive(true);
          }

          const { data: dbTasks, error: tError } = await client.from('tasks').select('*');
          if (!tError && dbTasks && dbTasks.length > 0) {
            // Transform snake_case columns if needed
            const formattedTasks = dbTasks.map(t => ({
              id: t.id,
              projectId: t.project_id || activeProject.id,
              title: t.title,
              description: t.description,
              status: t.status,
              priority: t.priority,
              assigneeName: t.assignee_name || 'Alex Chen',
              assigneeAvatar: t.assignee_avatar || '',
              dueDate: t.due_date,
              tags: ['Cloud', 'Postgres']
            }));
            setTasks(formattedTasks);
            setIsSupabaseLive(true);
          } else {
            setIsSupabaseLive(true);
          }
        } catch (e) {
          console.warn('Supabase fetch error', e);
          setIsSupabaseLive(false);
        }
      }
    } else {
      setIsSupabaseLive(false);
    }
  }, [activeProject?.id]);

  useEffect(() => {
    verifyBackendServices();
  }, [verifyBackendServices]);

  // Filter and search tasks for active project
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Must match active project (or default if single project demo)
      const matchesProject = !task.projectId || task.projectId === activeProject?.id;
      if (!matchesProject) return false;

      // Filter chip
      if (activeFilter === 'urgent' && (task.priority !== 'urgent' || task.status === 'done')) return false;
      if (activeFilter === 'high' && (task.priority !== 'high' || task.status === 'done')) return false;
      if (activeFilter === 'in_progress' && !['in_progress', 'review'].includes(task.status)) return false;
      if (activeFilter === 'done' && task.status !== 'done') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        const matchesAssignee = (task.assigneeName || '').toLowerCase().includes(query);
        const matchesTag = task.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesAssignee && !matchesTag) return false;
      }

      return true;
    });
  }, [tasks, activeProject, activeFilter, searchQuery]);

  // CRUD Operations with React Dataflow
  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Edit Task
      const updatedList = tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t));
      setTasks(updatedList);
      addToast(`Task "${taskData.title}" updated successfully.`);

      // Sync with Supabase if live
      if (isSupabaseLive) {
        const client = getSupabaseClient();
        if (client) {
          await client.from('tasks').update({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assignee_name: taskData.assigneeName,
            due_date: taskData.dueDate
          }).eq('id', editingTask.id);
        }
      }
    } else {
      // Create Task
      const newTask = {
        ...taskData,
        id: 'task-' + Date.now(),
        projectId: activeProject?.id || 'proj-core-platform',
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast(`New task created in "${taskData.status.toUpperCase()}" column.`);

      // Sync with Supabase if live
      if (isSupabaseLive) {
        const client = getSupabaseClient();
        if (client) {
          await client.from('tasks').insert({
            project_id: activeProject?.id,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assignee_name: taskData.assigneeName,
            due_date: taskData.dueDate
          });
        }
      }
    }
    setEditingTask(null);
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const task = tasks.find((t) => t.id === taskId);
    addToast(`"${task?.title?.slice(0, 24)}..." moved to ${newStatus.toUpperCase()}`);

    if (isSupabaseLive) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('tasks').update({ status: newStatus }).eq('id', taskId);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast(`Deleted task "${taskToDelete?.title?.slice(0, 24)}..."`, 'info');

    if (isSupabaseLive) {
      const client = getSupabaseClient();
      if (client) {
        await client.from('tasks').delete().eq('id', taskId);
      }
    }
  };

  const handleExportCsv = async () => {
    addToast('Generating task spreadsheet export...', 'info');
    const result = await exportTasksAsCsv({
      projectName: activeProject?.title || 'TaskFlow',
      tasks: filteredTasks
    });
    if (result.success) {
      addToast(`CSV export complete (${result.method})`);
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Ambient Background Glow */}
      <div className="ambient-glow" />

      {/* Top Navigation */}
      <Navbar
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewTask={() => {
          setEditingTask(null);
          setDefaultTaskStatus('todo');
          setIsTaskModalOpen(true);
        }}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseLive={isSupabaseLive}
        isPhpLive={isPhpLive}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentView={currentView}
        onToggleView={() => setCurrentView((v) => (v === 'board' ? 'analytics' : 'board'))}
        onExportCsv={handleExportCsv}
      />

      {/* Project Sprint Header */}
      <ProjectHeader
        project={activeProject}
        tasks={filteredTasks}
        teamMembers={teamMembers}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenReport={() => setIsReportModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area: Board or Analytics View */}
      <main style={{ flex: 1 }}>
        {currentView === 'board' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskWithStatus={(status) => {
              setEditingTask(null);
              setDefaultTaskStatus(status);
              setIsTaskModalOpen(true);
            }}
          />
        ) : (
          <AnalyticsView
            project={activeProject}
            tasks={filteredTasks}
            teamMembers={teamMembers}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* Task Creation & Editing Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        initialData={editingTask}
        teamMembers={teamMembers}
        defaultStatus={defaultTaskStatus}
      />

      {/* PHP Executive Sprint Report Modal */}
      <PHPReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projectName={activeProject?.title || 'TaskFlow Studio'}
        tasks={filteredTasks}
      />

      {/* Supabase PostgreSQL Configuration Modal */}
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        isSupabaseLive={isSupabaseLive}
        onConnectionChange={verifyBackendServices}
      />

      {/* Floating Action Feedback Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
