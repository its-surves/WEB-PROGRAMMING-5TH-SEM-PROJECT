import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Users, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AnalyticsView = ({
  project,
  tasks,
  teamMembers,
  onOpenReport
}) => {
  const total = tasks.length;
  const statusCounts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length
  };

  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  const completionRate = total > 0 ? Math.round((statusCounts.done / total) * 100) : 0;
  const inFlightRate = total > 0 ? Math.round(((statusCounts.in_progress + statusCounts.review) / total) * 100) : 0;

  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done');
  const bottlenecks = tasks.filter(t => ['urgent', 'high'].includes(t.priority) && ['todo', 'in_progress'].includes(t.status));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 100%)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <span className="badge" style={{ background: 'var(--primary)', color: '#fff', marginBottom: '0.5rem' }}>
            SPRINT HEALTH TELEMETRY
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{project?.title} Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Live reactive status aggregation and server-side workload forecasting.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.4rem' }}
        >
          <span>Run PHP Executive Audit</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Backlog</span>
            <Layers size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Active items across all swimlanes
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Completion Velocity</span>
            <CheckCircle2 size={18} style={{ color: 'var(--status-done)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--status-done)', lineHeight: 1 }}>{completionRate}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {statusCounts.done} of {total} tasks fully shipped
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active In Flight</span>
            <Clock size={18} style={{ color: 'var(--status-inprogress)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--status-inprogress)', lineHeight: 1 }}>
            {statusCounts.in_progress + statusCounts.review}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {inFlightRate}% of sprint actively moving
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Risk & Overdue</span>
            <AlertTriangle size={18} style={{ color: overdueTasks.length > 0 ? 'var(--priority-urgent)' : 'var(--status-done)' }} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: overdueTasks.length > 0 ? 'var(--priority-urgent)' : 'var(--status-done)', lineHeight: 1 }}>
            {overdueTasks.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {overdueTasks.length > 0 ? 'Urgent action required on due dates' : 'All milestones on schedule'}
          </div>
        </div>
      </div>

      {/* Pipeline Status Breakdown & Priority Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Pipeline Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Pipeline Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'To Do', count: statusCounts.todo, color: 'var(--status-todo)' },
              { label: 'In Progress', count: statusCounts.in_progress, color: 'var(--status-inprogress)' },
              { label: 'In Review', count: statusCounts.review, color: 'var(--status-review)' },
              { label: 'Completed', count: statusCounts.done, color: 'var(--status-done)' }
            ].map(item => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{item.label}</span>
                    <span>{item.count} items ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '9999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Priority Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Urgent Blockers', count: priorityCounts.urgent, color: 'var(--priority-urgent)' },
              { label: 'High Priority', count: priorityCounts.high, color: 'var(--priority-high)' },
              { label: 'Medium Priority', count: priorityCounts.medium, color: 'var(--priority-medium)' },
              { label: 'Low Priority', count: priorityCounts.low, color: 'var(--priority-low)' }
            ].map(item => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <span>{item.label}</span>
                    <span>{item.count} items ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '9999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottlenecks Radar Table */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ShieldAlert size={20} style={{ color: 'var(--priority-urgent)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Bottleneck & Risk Radar</h3>
        </div>

        {bottlenecks.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Critical Task</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Priority</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Assignee</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Target Date</th>
                </tr>
              </thead>
              <tbody>
                {bottlenecks.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{b.title}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge badge-priority-${b.priority}`}>
                        {b.priority.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{b.assigneeName}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--priority-urgent)', fontWeight: 600 }}>{b.dueDate || 'Unset'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--status-done)', padding: '1rem 0', fontWeight: 600 }}>
            ✅ Zero bottleneck risks detected! All urgent and high priority items are progressing nominal.
          </div>
        )}
      </div>
    </div>
  );
};
