import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from 'lucide-react';

export const ProjectHeader = ({
  project,
  tasks,
  teamMembers,
  activeFilter,
  onFilterChange,
  onOpenReport,
  onExportCsv
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filters = [
    { id: 'all', label: 'All Tasks', count: totalTasks },
    { id: 'urgent', label: 'Urgent', count: urgentTasks, alert: urgentTasks > 0 },
    { id: 'high', label: 'High Priority', count: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length },
    { id: 'in_progress', label: 'In Flight', count: tasks.filter(t => t.status === 'in_progress' || t.status === 'review').length },
    { id: 'done', label: 'Completed', count: completedTasks }
  ];

  return (
    <section style={{
      padding: '1.75rem 2rem 1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {/* Left: Project Info */}
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: project?.color || '#6366f1',
              boxShadow: `0 0 10px ${project?.color || '#6366f1'}`
            }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{project?.title}</h1>
            <span className="badge" style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
              {project?.category || 'Active Sprint'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            {project?.description}
          </p>
        </div>

        {/* Right: Team & Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={onOpenReport}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--primary-glow)' }}
            >
              <FileText size={15} style={{ color: 'var(--primary)' }} />
              <span>PHP Executive Report</span>
            </button>

            <button
              onClick={onExportCsv}
              className="btn btn-secondary btn-sm"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Team Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>TEAM:</span>
            <div style={{ display: 'flex', marginLeft: '4px' }}>
              {teamMembers.map((member, i) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={`${member.name} (${member.role})`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid var(--bg-surface)',
                    marginLeft: i > 0 ? '-8px' : '0',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Progress Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Sprint Completion: <strong style={{ color: 'var(--text-main)' }}>{completedTasks} of {totalTasks}</strong> tasks completed ({progressPercent}%)
          </span>
        </div>

        <div style={{ flex: '1', minWidth: '200px', maxWidth: '350px' }}>
          <div style={{
            background: 'var(--bg-surface-elevated)',
            height: '8px',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              width: `${progressPercent}%`,
              height: '100%',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {urgentTasks > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--priority-urgent)', fontSize: '0.82rem', fontWeight: 700 }}>
            <AlertCircle size={15} />
            <span>{urgentTasks} Critical / Urgent Blockers Active</span>
          </div>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 700, marginRight: '0.3rem' }}>
          <Filter size={13} /> FILTERS:
        </span>
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            style={{
              background: activeFilter === f.id ? 'var(--primary)' : 'var(--bg-surface)',
              color: activeFilter === f.id ? '#ffffff' : 'var(--text-muted)',
              border: `1px solid ${activeFilter === f.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{f.label}</span>
            <span style={{
              background: activeFilter === f.id ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.1rem 0.45rem',
              fontSize: '0.72rem'
            }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
