import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const COLORS = {
  success: 'var(--success)',
  error:   'var(--danger)',
  warning: 'var(--warning)',
  info:    'var(--info)',
};

const BG_COLORS = {
  success: 'var(--success-bg)',
  error:   'var(--danger-bg)',
  warning: 'var(--warning-bg)',
  info:    'var(--info-bg)',
};

const ToastItem = ({ toast, onRemove }) => {
  const [leaving, setLeaving] = useState(false);
  const Icon = ICONS[toast.type] || Info;
  const color = COLORS[toast.type] || COLORS.info;
  const bg = BG_COLORS[toast.type] || BG_COLORS.info;

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 280);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: 'var(--surface)',
        border: `1px solid var(--border2)`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        minWidth: '300px',
        maxWidth: '380px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        animation: leaving ? 'toastOut 0.28s ease forwards' : 'toastIn 0.3s ease both',
        transition: 'background var(--transition)',
      }}
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: 8,
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 500,
          color: 'var(--text)',
          lineHeight: 1.4,
          fontFamily: 'var(--font)',
        }}>
          {toast.message}
        </p>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'none', border: 'none',
          color: 'var(--muted)', cursor: 'pointer',
          padding: '2px', borderRadius: 4,
          display: 'flex', alignItems: 'center',
          transition: 'color var(--transition)',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: 20, right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;