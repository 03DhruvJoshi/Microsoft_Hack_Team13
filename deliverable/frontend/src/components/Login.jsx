import React, { useState } from 'react';
import { API_BASE } from '../constants';

export default function Login({ theme, mono, setPage, setUser }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const body = mode === 'register'
      ? { email, name, password }
      : { email, password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `Error ${res.status}`);
      localStorage.setItem('preppath_token', data.access_token);
      localStorage.setItem('preppath_user', JSON.stringify(data.user));
      setUser(data.user);
      setPage('onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg }} className="fade-up">
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 8 }}>PrepPath</div>
          <h1 className="serif" style={{ fontSize: 48, fontWeight: 500, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {mode === 'login' ? 'Welcome back.' : 'Get started.'}
          </h1>
          <p style={{ marginTop: 12, color: theme.inkSoft, fontSize: 16 }}>
            {mode === 'login' ? 'Sign in to access your roadmap.' : 'Create an account to save your progress.'}
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div>
              <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 6 }}>Full Name</label>
              <input
                type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Alex Johnson"
                style={{ width: '100%', padding: '12px 14px', border: `1px solid ${theme.rule}`, background: theme.bg, color: theme.ink, fontSize: 15 }}
              />
            </div>
          )}

          <div>
            <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 6 }}>Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '12px 14px', border: `1px solid ${theme.rule}`, background: theme.bg, color: theme.ink, fontSize: 15 }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 6 }}>Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={{ width: '100%', padding: '12px 14px', border: `1px solid ${theme.rule}`, background: theme.bg, color: theme.ink, fontSize: 15 }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: `${theme.error}15`, borderLeft: `3px solid ${theme.error}`, color: theme.error, fontSize: 14 }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '16px 0', background: theme.ink, color: theme.bg,
            fontWeight: 600, fontSize: 15, letterSpacing: '0.04em',
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ fontSize: 14, color: theme.inkSoft }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} style={{ fontSize: 14, color: theme.accent, fontWeight: 500, textDecoration: 'underline' }}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => setPage('onboarding')} style={{ fontSize: 13, color: theme.inkFaint }}>
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}
