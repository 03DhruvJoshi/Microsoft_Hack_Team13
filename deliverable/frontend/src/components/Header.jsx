import React from 'react';
import { Bell, LogOut, LogIn } from 'lucide-react';

export default function Header({ page, setPage, theme, mono, user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'G';

  return (
    <header style={{
      borderBottom: `1px solid ${theme.rule}`,
      background: theme.bg,
      position: 'sticky', top: 0, zIndex: 10,
      padding: '20px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <button onClick={() => setPage('dashboard')} className="serif" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em' }}>
          PrepPath<span style={{ color: theme.accent }}>.</span>
        </button>
        <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase' }}>v2.0</span>
      </div>

      <nav style={{ display: 'flex', gap: 28 }}>
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'roadmap', label: 'Roadmap' },
          { id: 'calendar', label: 'Calendar' },
          { id: 'practice', label: 'Practice' },
        ].map(link => (
          <button key={link.id} onClick={() => setPage(link.id)} className="mono" style={{
            fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontWeight: page === link.id ? 600 : 400,
            color: page === link.id ? theme.ink : theme.inkFaint,
            borderBottom: page === link.id ? `2px solid ${theme.accent}` : '2px solid transparent',
            paddingBottom: 4,
          }}>{link.label}</button>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 140 }}>
        

        {/* User avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: theme.ink, color: theme.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600,
          }}>{initials}</div>
          {user && (
            <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: '0.05em', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </span>
          )}
        </div>

        {user ? (
          <button
            onClick={onLogout}
            aria-label="Sign out"
            title="Sign out"
            style={{ padding: 6, color: theme.inkFaint, display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={16} />
          </button>
        ) : (
          <button
            onClick={() => setPage('login')}
            aria-label="Sign in"
            className="mono"
            style={{ padding: '6px 12px', border: `1px solid ${theme.rule}`, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <LogIn size={12} /> Sign in
          </button>
        )}
      </div>
    </header>
  );
}
