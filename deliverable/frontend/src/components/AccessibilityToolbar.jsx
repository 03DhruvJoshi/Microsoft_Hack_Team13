import React from 'react';
import { Accessibility, X } from 'lucide-react';

function ToggleRow({ label, value, onChange, theme, activeColor }) {
  const onColor = activeColor || theme.accent;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button
        role="switch" aria-checked={value} aria-label={label}
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 22, borderRadius: 9999,
          background: value ? onColor : theme.inkFaint,
          position: 'relative', transition: 'background 0.2s',
        }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 24 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}

export default function AccessibilityToolbar({
  open, setOpen, zoom, setZoom,
  highContrast, setHighContrast,
  dyslexiaFont, setDyslexiaFont,
  reduceMotion, setReduceMotion,
  textSize, setTextSize,
  theme, mono, transition,
}) {
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Accessibility options"
        className="mono"
        style={{
          position: 'fixed', top: 18, right: 16, zIndex: 1000,
          background: theme.ink, color: theme.bg,
          padding: '10px 16px', borderRadius: 0,
          display: 'flex', alignItems: 'center', gap: 8,
          fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transition,
        }}
      >
        <Accessibility size={14} /> Accessibility
      </button>

      {open && (
        <div style={{
          position: 'fixed', top: 72, right: 16, zIndex: 1000,
          background: theme.surface, color: theme.ink,
          border: `1px solid ${theme.rule}`, padding: 24, width: 320,
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${theme.rule}` }}>
            <span className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Accessibility</span>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 8 }}>Zoom</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[100, 125, 150].map(z => (
                <button key={z} onClick={() => setZoom(z)} className="mono" style={{
                  flex: 1, padding: '8px 0', fontSize: 12,
                  background: zoom === z ? theme.ink : 'transparent',
                  color: zoom === z ? theme.bg : theme.ink,
                  border: `1px solid ${theme.rule}`,
                  fontWeight: 500,
                }}>{z}%</button>
              ))}
            </div>
          </div>

          <ToggleRow label="High contrast" value={highContrast} onChange={setHighContrast} theme={theme} activeColor="#FFD60A" />
          <ToggleRow label="Dyslexia-friendly font" value={dyslexiaFont} onChange={setDyslexiaFont} theme={theme} />
          <ToggleRow label="Reduce motion" value={reduceMotion} onChange={setReduceMotion} theme={theme} />

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.rule}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkFaint }}>Text size</span>
              <span className="mono" style={{ fontSize: 11, color: theme.ink }}>{textSize}px</span>
            </div>
            <input type="range" min={14} max={22} value={textSize} onChange={e => setTextSize(+e.target.value)}
              style={{ width: '100%', accentColor: theme.accent }}
              aria-label={`Text size, currently ${textSize} pixels`}
            />
          </div>
        </div>
      )}
    </>
  );
}
