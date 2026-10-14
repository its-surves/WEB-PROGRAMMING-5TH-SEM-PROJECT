import React from 'react';
import { TaskCard } from './TaskCard';
import { 
  CircleDot, 
  Clock3, 
  Eye, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';

export const KanbanBoard = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskWithStatus
}) => {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      description: 'Backlog items pending start',
      icon: <CircleDot size={16} style={{ color: 'var(--status-todo)' }} />,
      accentColor: 'var(--status-todo)',
      tasks: tasks.filter(t => t.status === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      description: 'Actively being engineered',
      icon: <Clock3 size={16} style={{ color: 'var(--status-inprogress)' }} />,
      accentColor: 'var(--status-inprogress)',
      tasks: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'review',
      title: 'In Review',
      description: 'Code review & QA testing',
      icon: <Eye size={16} style={{ color: 'var(--status-review)' }} />,
      accentColor: 'var(--status-review)',
      tasks: tasks.filter(t => t.status === 'review')
    },
    {
      id: 'done',
      title: 'Completed',
      description: 'Shipped & verified',
      icon: <CheckCircle2 size={16} style={{ color: 'var(--status-done)' }} />,
      accentColor: 'var(--status-done)',
      tasks: tasks.filter(t => t.status === 'done')
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      padding: '1.5rem 2rem 2.5rem',
      alignItems: 'start'
    }}>
      {columns.map(col => (
        <div
          key={col.id}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '500px'
          }}
        >
          {/* Column Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.85rem',
            marginBottom: '0.85rem',
            borderBottom: `2px solid ${col.accentColor}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {col.icon}
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{col.title}</h2>
            </div>
            <span style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.15rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}>
              {col.tasks.length}
            </span>
          </div>

          {/* Cards List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            flex: '1'
          }}>
            {col.tasks.length > 0 ? (
              col.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={onUpdateStatus}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))
            ) : (
              <div style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--text-dim)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem'
              }}>
                No tasks in this lane
              </div>
            )}
          </div>

          {/* Column Quick Add Button */}
          <button
            onClick={() => onOpenNewTaskWithStatus(col.id)}
            className="btn btn-ghost"
            style={{
              marginTop: '1rem',
              width: '100%',
              justifyContent: 'center',
              border: '1px dashed var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}
          >
            <Plus size={14} />
            <span>Add task to {col.title}</span>
          </button>
        </div>
      ))}
    </div>
  );
};
