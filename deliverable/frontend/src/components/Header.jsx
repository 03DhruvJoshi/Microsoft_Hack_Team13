import React from 'react';
import { Bell } from 'lucide-react';

export default function Header({ page, setPage, theme, mono }) {
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
        <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase' }}>
          Issue №07 · Spring Term
        </span>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 140 }}>
        <button aria-label="Notifications" style={{ position: 'relative', padding: 6 }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: theme.accent }} />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: theme.ink, color: theme.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600,
        }}>DT</div>
      </div>
    </header>
  );
}
