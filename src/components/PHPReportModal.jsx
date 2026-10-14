import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Terminal, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { generateExecutiveReport } from '../services/reportService';

export const PHPReportModal = ({
  isOpen,
  onClose,
  projectName,
  tasks
}) => {
  const [loading, setLoading] = useState(true);
  const [reportResult, setReportResult] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await generateExecutiveReport({
        projectName,
        tasks,
        format: 'html'
      });
      setReportResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [isOpen, projectName, tasks]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '940px', height: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              padding: '6px',
              borderRadius: '8px'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>PHP Server-Side Executive Briefing</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Automated Sprint Audit &bull; Backend: <code>backend/api/report_generator.php</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={fetchReport}
              className="btn btn-secondary btn-sm"
              title="Re-run report"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Regenerate</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '0.4rem', borderRadius: '50%' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status Notification Strip */}
        <div style={{
          padding: '0.65rem 1.5rem',
          background: reportResult?.isPhpLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.1)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {reportResult?.isPhpLive ? (
              <>
                <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                <span><strong>Live PHP 8 Backend Active:</strong> Response processed and compiled on server-side.</span>
              </>
            ) : (
              <>
                <Terminal size={15} style={{ color: '#818cf8' }} />
                <span>
                  <strong>PHP Backend Ready:</strong> Server script located at <code>/backend/api/report_generator.php</code>. Run <code>php -S localhost:8000 -t backend</code> to connect live server.
                </span>
              </>
            )}
          </div>

          {reportResult?.data?.reportHash && (
            <div style={{ color: 'var(--text-dim)', fontFamily: 'monospace' }}>
              SHA-256: {reportResult.data.reportHash.slice(0, 16)}...
            </div>
          )}
        </div>

        {/* Modal Body / Report Container */}
        <div style={{ flex: '1', overflow: 'hidden', position: 'relative', background: '#0b0f19' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={24} className="spin" />
              <span>Generating executive briefing...</span>
            </div>
          ) : reportResult?.isPhpLive && reportResult?.html ? (
            <iframe
              srcDoc={reportResult.html}
              title="PHP Executive Report"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            // Client Rendered Fallback with identical sleek styling
            <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      Audit Assessment Briefing
                    </span>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{projectName}</h1>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Generated on {reportResult?.data?.generatedAt}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>TaskFlow Report Engine</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Academic Mini-Project Spec</div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {reportResult?.data?.metrics?.totalTasks}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Tasks</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-done)' }}>
                      {reportResult?.data?.metrics?.completionRate}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion Velocity</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-inprogress)' }}>
                      {reportResult?.data?.metrics?.inFlightRate}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In-Flight</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: reportResult?.data?.metrics?.overdueTasks > 0 ? 'var(--priority-urgent)' : 'var(--status-done)' }}>
                      {reportResult?.data?.metrics?.overdueTasks}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>⚠️ Bottleneck Risks</h3>
                {reportResult?.data?.metrics?.bottlenecks?.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '8px' }}>Task</th>
                        <th style={{ padding: '8px' }}>Priority</th>
                        <th style={{ padding: '8px' }}>Status</th>
                        <th style={{ padding: '8px' }}>Assignee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportResult.data.metrics.bottlenecks.map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '8px', fontWeight: 600 }}>{b.title}</td>
                          <td style={{ padding: '8px', color: 'var(--priority-urgent)', fontWeight: 700 }}>{b.priority.toUpperCase()}</td>
                          <td style={{ padding: '8px' }}>{b.status}</td>
                          <td style={{ padding: '8px' }}>{b.assignee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--status-done)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    ✅ Zero high-severity bottlenecks found.
                  </p>
                )}

                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>Verification Digest:</strong> <code>{reportResult?.data?.reportHash}</code>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-primary btn-sm"
                  >
                    <Printer size={14} />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
