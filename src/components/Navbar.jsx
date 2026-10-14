import React from 'react';
import { 
  Zap, 
  Search, 
  Plus, 
  Database, 
  FileCode, 
  Sun, 
  Moon, 
  BarChart3, 
  Kanban,
  FileSpreadsheet
} from 'lucide-react';

export const Navbar = ({
  projects,
  activeProject,
  onSelectProject,
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenReport,
  onOpenSupabaseModal,
  isSupabaseLive,
  isPhpLive,
  theme,
  onToggleTheme,
  currentView,
  onToggleView,
  onExportCsv
}) => {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Project Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            color: '#fff',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
              TaskFlow <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Studio</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Full-Stack Suite
            </div>
          </div>
        </div>

        {/* Project Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>WORKSPACE:</span>
          <select
            value={activeProject?.id || ''}
            onChange={(e) => {
              const selected = projects.find(p => p.id === e.target.value);
              if (selected) onSelectProject(selected);
            }}
            className="form-select"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              width: 'auto',
              minWidth: '220px'
            }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div style={{ flex: '1', maxWidth: '380px', minWidth: '200px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          placeholder="Filter tasks by title, tag, or assignee..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
          style={{
            paddingLeft: '36px',
            paddingRight: '12px',
            paddingTop: '0.45rem',
            paddingBottom: '0.45rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>

      {/* Right: Status Indicators & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Supabase Indicator Button */}
        <button
          onClick={onOpenSupabaseModal}
          className="btn btn-secondary btn-sm"
          title="Configure Supabase Database & Auth"
          style={{ fontSize: '0.78rem' }}
        >
          <Database size={14} style={{ color: isSupabaseLive ? '#10b981' : '#f59e0b' }} />
          <span>Supabase:</span>
          <span style={{ color: isSupabaseLive ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
            {isSupabaseLive ? 'Live Postgres' : 'Demo State'}
          </span>
        </button>

        {/* PHP Backend Indicator / Report Trigger */}
        <button
          onClick={onOpenReport}
          className="btn btn-secondary btn-sm"
          title="Generate Executive Sprint Briefing via PHP Engine"
          style={{ fontSize: '0.78rem' }}
        >
          <FileCode size={14} style={{ color: isPhpLive ? '#10b981' : '#818cf8' }} />
          <span>PHP Engine:</span>
          <span style={{ color: isPhpLive ? '#10b981' : '#818cf8', fontWeight: 700 }}>
            {isPhpLive ? 'Live 8.x' : 'Report Ready'}
          </span>
        </button>

        {/* View Switcher (Board vs Analytics) */}
        <button
          onClick={onToggleView}
          className="btn btn-secondary btn-sm"
          title={currentView === 'board' ? 'Switch to Analytics' : 'Switch to Board'}
        >
          {currentView === 'board' ? <BarChart3 size={15} /> : <Kanban size={15} />}
          <span>{currentView === 'board' ? 'Analytics' : 'Board'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn btn-secondary btn-icon"
          title="Toggle Light/Dark Theme"
          style={{ padding: '0.45rem' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* New Task Button */}
        <button
          onClick={onOpenNewTask}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
