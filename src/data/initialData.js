// Default seed data for TaskFlow Studio

export const INITIAL_PROJECTS = [
  {
    id: 'proj-core-platform',
    title: 'TaskFlow V2.0 Core Platform',
    description: 'Next-gen collaborative project workspace with real-time reactive state flow, Supabase Postgres backend, and automated PHP executive reports.',
    color: '#6366f1',
    category: 'Engineering',
    startDate: '2026-10-01',
    targetDate: '2026-11-15'
  },
  {
    id: 'proj-mobile-app',
    title: 'Mobile Companion App',
    description: 'Cross-platform progressive web app with offline sync and push notification support.',
    color: '#06b6d4',
    category: 'Product',
    startDate: '2026-10-10',
    targetDate: '2026-12-01'
  },
  {
    id: 'proj-design-system',
    title: 'NeonGlass UI Component Kit',
    description: 'Comprehensive design system token library with accessible components and dark mode presets.',
    color: '#a855f7',
    category: 'Design',
    startDate: '2026-09-15',
    targetDate: '2026-10-30'
  }
];

export const TEAM_MEMBERS = [
  { id: 'usr-1', name: 'Alex Chen', role: 'Full Stack Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces' },
  { id: 'usr-2', name: 'Elena Vance', role: 'UI/UX Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces' },
  { id: 'usr-3', name: 'Marcus Brody', role: 'Systems Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces' },
  { id: 'usr-4', name: 'Sophia Lin', role: 'Database Specialist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces' }
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    projectId: 'proj-core-platform',
    title: 'Design Modern CSS Design Tokens & Glassmorphism',
    description: 'Implement dark/light themes, HSL colors, responsive typography, and micro-interaction animations.',
    status: 'done',
    priority: 'high',
    assigneeName: 'Elena Vance',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-12',
    tags: ['CSS', 'Design System', 'UI'],
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'task-102',
    projectId: 'proj-core-platform',
    title: 'Build Unidirectional React Dataflow & Custom Hooks',
    description: 'Ensure clean props passing, context-based state synchronization, optimistic UI mutations, and search filters.',
    status: 'done',
    priority: 'urgent',
    assigneeName: 'Alex Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-13',
    tags: ['React', 'JavaScript', 'State'],
    createdAt: '2026-10-04T11:30:00Z'
  },
  {
    id: 'task-103',
    projectId: 'proj-core-platform',
    title: 'Integrate Supabase Postgres Schema & RLS Policies',
    description: 'Formulate SQL migrations for projects, tasks, activity logs, and real-time publication hooks.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeName: 'Sophia Lin',
    assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-16',
    tags: ['Supabase', 'PostgreSQL', 'Security'],
    createdAt: '2026-10-06T09:15:00Z'
  },
  {
    id: 'task-104',
    projectId: 'proj-core-platform',
    title: 'Develop PHP Executive Sprint Report Engine',
    description: 'Write server-side PHP endpoint (report_generator.php) computing completion velocity, bottleneck flags, and printable executive summaries.',
    status: 'in_progress',
    priority: 'high',
    assigneeName: 'Marcus Brody',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-17',
    tags: ['PHP', 'Backend', 'API'],
    createdAt: '2026-10-07T14:00:00Z'
  },
  {
    id: 'task-105',
    projectId: 'proj-core-platform',
    title: 'Implement Interactive Kanban Drag / Drop Status Flow',
    description: 'Allow team members to fluidly transition cards across To Do, In Progress, Review, and Done with sound/confetti reward.',
    status: 'review',
    priority: 'medium',
    assigneeName: 'Alex Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-18',
    tags: ['Frontend', 'Kanban', 'UX'],
    createdAt: '2026-10-08T16:20:00Z'
  },
  {
    id: 'task-106',
    projectId: 'proj-core-platform',
    title: 'Configure Git Repository & Continuous Workflow Docs',
    description: 'Prepare clean semantic commit history, project README, architecture diagrams, and academic submission notes.',
    status: 'todo',
    priority: 'medium',
    assigneeName: 'Elena Vance',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-20',
    tags: ['Git', 'Documentation', 'DevOps'],
    createdAt: '2026-10-09T08:45:00Z'
  },
  {
    id: 'task-107',
    projectId: 'proj-core-platform',
    title: 'Automate Server-Side CSV Data Export Service',
    description: 'Stream clean UTF-8 CSV exports from PHP microservice for stakeholder spreadsheet integrations.',
    status: 'todo',
    priority: 'low',
    assigneeName: 'Marcus Brody',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    dueDate: '2026-10-22',
    tags: ['PHP', 'CSV', 'Export'],
    createdAt: '2026-10-10T12:00:00Z'
  }
];
