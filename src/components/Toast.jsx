import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={18} style={{ color: 'var(--status-done)' }} />;
        if (toast.type === 'error') {
          icon = <AlertTriangle size={18} style={{ color: 'var(--priority-urgent)' }} />;
        } else if (toast.type === 'info') {
          icon = <Info size={18} style={{ color: 'var(--primary)' }} />;
        }

        return (
          <div key={toast.id} className="toast">
            {icon}
            <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn btn-ghost"
              style={{ padding: '0.2rem', color: 'var(--text-dim)' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
