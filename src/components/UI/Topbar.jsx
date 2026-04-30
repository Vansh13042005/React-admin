import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const Topbar = ({ title = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const handleThemeToggle = () => {
    toggleTheme();
    addToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'info', 2000);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 'var(--sidebar-w)',
      right: 0, height: 'var(--topbar-h)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border2)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px',
      justifyContent: 'space-between',
      zIndex: 90,
      transition: 'background var(--transition), border-color var(--transition)',
    }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 36, height: 36,
            background: 'var(--surface2)',
            border: '1px solid var(--border2)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;