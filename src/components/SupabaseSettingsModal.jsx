import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Link, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection 
} from '../lib/supabase';

export const SupabaseSettingsModal = ({
  isOpen,
  onClose,
  isSupabaseLive,
  onConnectionChange
}) => {
  const credentials = getSupabaseCredentials();
  const [url, setUrl] = useState(credentials.url || '');
  const [anonKey, setAnonKey] = useState(credentials.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    setTesting(true);
    setStatusMessage(null);

    saveSupabaseCredentials(url, anonKey);
    const result = await testSupabaseConnection();

    setTesting(false);
    setStatusMessage(result);
    onConnectionChange();
  };

  const handleResetToDemo = () => {
    saveSupabaseCredentials('', '');
    setUrl('');
    setAnonKey('');
    setStatusMessage({
      success: true,
      message: 'Reset to interactive Demo State. Using localStorage persistence.'
    });
    onConnectionChange();
  };

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-medium)',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database size={20} style={{ color: '#10b981' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Supabase PostgreSQL Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Status Alert Banner */}
          <div style={{
            background: isSupabaseLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isSupabaseLive ? '#10b981' : '#f59e0b'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem'
          }}>
            {isSupabaseLive ? (
              <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
            )}
            <div>
              <strong>Current Status: {isSupabaseLive ? 'Connected to Live Supabase' : 'Interactive Demo Mode'}</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {isSupabaseLive 
                  ? 'All tasks and projects are synced with your cloud PostgreSQL database in realtime.'
                  : 'Tasks are safely stored in browser storage. Paste your Supabase keys below to switch to Cloud Postgres anytime.'}
              </div>
            </div>
          </div>

          {statusMessage && (
            <div style={{
              background: statusMessage.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${statusMessage.success ? '#10b981' : '#f43f5e'}`,
              color: statusMessage.success ? '#10b981' : 'var(--priority-urgent)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              fontWeight: 600
            }}>
              {statusMessage.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleTestAndSave}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Link size={13} /> Supabase Project URL
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={13} /> Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-medium)'
            }}>
              <button
                type="button"
                onClick={handleResetToDemo}
                className="btn btn-secondary btn-sm"
              >
                Reset to Demo Mode
              </button>

              <button
                type="submit"
                disabled={testing}
                className="btn btn-primary"
              >
                {testing ? <RefreshCw size={15} className="spin" /> : <CheckCircle2 size={15} />}
                <span>{testing ? 'Testing...' : 'Save & Connect'}</span>
              </button>
            </div>
          </form>

          {/* Setup Guide Accordion */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🚀 3-Step Supabase Cloud Setup</span>
              <button
                onClick={handleCopySchemaPath}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}
              >
                <Copy size={12} />
                <span>{copied ? 'Path Copied!' : 'Copy Schema File Path'}</span>
              </button>
            </div>
            <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              <li>Create a free database at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>supabase.com</a>.</li>
              <li>Go to <strong>SQL Editor</strong> & execute our provided script in <code>supabase/schema.sql</code>.</li>
              <li>Copy your <strong>Project URL</strong> and <strong>anon key</strong> from Settings &rarr; API into the inputs above!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
