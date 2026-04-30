import React, { useState } from 'react';
import { Moon, Sun, LogIn, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail]         = useState('admin@portfolio.com');
  const [password, setPassword]   = useState('admin123');
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      addToast('Please fill in all fields', 'error');
      return;
    }
    setError('');
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      addToast('Welcome back! 👋', 'success');
    } else {
      const msg = res.message || 'Invalid credentials';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  /* ── Ambient orbs ───────────────────────────────────────── */
  const orb = (w, h, color, top, left, right, bottom) => ({
    position: 'absolute', width: w, height: h,
    borderRadius: '50%', background: color,
    filter: 'blur(80px)',
    opacity: isDark ? 0.18 : 0.1,
    top, left, right, bottom,
    pointerEvents: 'none',
    transition: 'opacity 0.4s',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font)',
      transition: 'background 0.4s',
    }}>
      {/* Orbs */}
      <div style={orb(400, 400, 'var(--accent)', -80, -80, undefined, undefined)} />
      <div style={orb(300, 300, 'var(--accent2)', undefined, undefined, -60, -40)} />
      <div style={orb(200, 200, 'var(--info)', '40%', '55%', undefined, undefined)} />

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <button
        onClick={() => { toggleTheme(); addToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'info', 2000); }}
        style={{
          position: 'absolute', top: 20, right: 20,
          width: 40, height: 40,
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--muted)',
          transition: 'all var(--transition)', zIndex: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 2,
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 36px',
        width: '100%', maxWidth: 420,
        animation: 'fadeUp 0.4s ease both',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 54, height: 54, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600,
            color: '#fff', letterSpacing: '-0.5px',
            boxShadow: '0 0 0 6px var(--accent-glow)',
          }}>CMS</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.03em' }}>
            Portfolio Admin
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>
            Sign in to manage your content
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px', marginBottom: 20,
            fontSize: 13, color: 'var(--danger)',
            animation: 'slideDown 0.25s ease',
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: 11, fontWeight: 500, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              fontFamily: 'var(--mono)',
            }}>Email *</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@portfolio.com"
              disabled={isLoading}
              style={{
                width: '100%', background: 'var(--surface2)',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--radius-sm)',
                padding: '11px 14px', fontSize: 13,
                color: 'var(--text)', fontFamily: 'var(--font)',
                outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: 11, fontWeight: 500, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              fontFamily: 'var(--mono)',
            }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                style={{
                  width: '100%', background: 'var(--surface2)',
                  border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '11px 44px 11px 14px', fontSize: 13,
                  color: 'var(--text)', fontFamily: 'var(--font)',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', display: 'flex', alignItems: 'center',
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '12px',
              background: isLoading ? 'var(--surface2)' : 'linear-gradient(135deg, var(--accent), var(--accent2))',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: isLoading ? 'var(--muted)' : '#fff',
              fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : '0 4px 16px var(--accent-glow)',
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid var(--border3)',
                  borderTopColor: 'var(--accent)',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Signing in…
              </>
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>

        {/* Demo box */}
        <div style={{
          marginTop: 24,
          background: 'var(--surface2)',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
        }}>
          <p style={{
            fontSize: 10, fontWeight: 600, color: 'var(--accent2)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            fontFamily: 'var(--mono)', marginBottom: 8,
          }}>Demo credentials</p>
          {[
            ['Email', 'admin@portfolio.com'],
            ['Password', 'admin123'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: 'var(--muted)', padding: '3px 0',
            }}>
              <span>{k}</span>
              <span style={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;