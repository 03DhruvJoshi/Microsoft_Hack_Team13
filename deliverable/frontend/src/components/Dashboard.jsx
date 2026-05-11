import React from 'react';
import { TrendingUp, Download } from 'lucide-react';

export default function Dashboard({ theme, mono, setPage, roadmapData }) {
  const name = roadmapData?.candidate_name || 'Daniel';
  const company = roadmapData?.company || 'Spotify';

  return (
    <div style={{ padding: '48px 40px', maxWidth: 1240, margin: '0 auto' }} className="fade-up">
      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 32, marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Dashboard · Welcome back, {name}
        </div>
        <h1 className="serif" style={{ fontSize: 64, fontWeight: 500, margin: 0, lineHeight: 0.98, letterSpacing: '-0.03em' }}>
          You're <em>58%</em> there.
        </h1>
        <p style={{ fontSize: 17, color: theme.inkSoft, marginTop: 16, maxWidth: 540 }}>
          {roadmapData
            ? `${roadmapData.days_to_interview} days until your ${company} interview. Keep the momentum.`
            : `Eleven days until your ${company} interview. Keep the momentum.`
          }
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Sessions completed', value: '7', sub: '/ 12', extra: 'bar' },
          { label: 'Questions practised', value: '24', sub: '', extra: 'spark' },
          { label: 'Average score', value: '74', sub: '%', extra: 'trend' },
        ].map((s, i) => (
          <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="serif" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1 }}>{s.value}</span>
              <span className="serif" style={{ fontSize: 24, color: theme.inkFaint }}>{s.sub}</span>
            </div>
            {s.extra === 'bar' && (
              <div style={{ marginTop: 16, height: 3, background: theme.surfaceAlt }}>
                <div style={{ width: '58%', height: '100%', background: theme.accent }} />
              </div>
            )}
            {s.extra === 'spark' && (
              <svg width="100%" height="32" viewBox="0 0 120 32" style={{ marginTop: 12 }}>
                <polyline points="0,24 20,20 40,22 60,14 80,16 100,8 120,10"
                  fill="none" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            {s.extra === 'trend' && (
              <div className="mono" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: theme.success, fontSize: 11, letterSpacing: '0.1em' }}>
                <TrendingUp size={12} /> +6% THIS WEEK
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: 20, marginBottom: 32 }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 20 }}>
            Recent Practice
          </div>
          {[
            { date: 'TODAY', q: 'Tell me about a time you handled conflict…', score: 82 },
            { date: 'YESTERDAY', q: 'Why are you interested in this role?', score: 71 },
            { date: '2D AGO', q: 'Describe a project you led from start to finish', score: 76 },
            { date: '3D AGO', q: 'What is your biggest weakness?', score: 65 },
          ].map((s, i) => (
            <div key={i} className="card-hover" style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 50px 60px',
              alignItems: 'center', gap: 16, padding: '14px 8px',
              borderBottom: i < 3 ? `1px solid ${theme.surfaceAlt}` : 'none',
            }}>
              <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em' }}>{s.date}</span>
              <span className="serif" style={{ fontSize: 17, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.q}</span>
              <span className="serif" style={{ fontSize: 22, fontWeight: 600, color: s.score > 70 ? theme.success : theme.warning }}>{s.score}</span>
              <button className="mono" style={{ color: theme.ink, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Review →</button>
            </div>
          ))}
        </div>

        <div style={{ background: theme.ink, color: theme.bg, padding: 28 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 20 }}>
            Coming up
          </div>
          {[
            { date: 'THU', time: '15:00', title: 'Behavioural drills' },
            { date: 'FRI', time: '10:30', title: 'Confidence practice' },
            { date: 'SAT', time: '14:00', title: 'Full mock interview' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 2 ? `1px solid ${theme.inkSoft}33` : 'none' }}>
              <div style={{ textAlign: 'center', minWidth: 40 }}>
                <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em' }}>{s.date}</div>
                <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{s.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 17 }}>{s.title}</div>
              </div>
              <button onClick={() => setPage('practice')} className="mono" style={{ color: theme.accent, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Start →</button>
            </div>
          ))}
          <button onClick={() => setPage('calendar')} style={{ marginTop: 20, width: '100%', padding: 14, background: theme.accent, color: theme.ink, fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Download size={14} /> Export to my calendar
          </button>
        </div>
      </div>

      {/* Improvement chart */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 4 }}>The Trend Line</div>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>Your improvement</h3>
          </div>
          <span className="mono" style={{ fontSize: 11, color: theme.inkFaint }}>Last 8 sessions</span>
        </div>
        <svg width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="none" style={{ display: 'block' }}>
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1="0" y1={40 * i + 20} x2="600" y2={40 * i + 20} stroke={theme.surfaceAlt} strokeWidth="1" />
          ))}
          <path d="M 0,140 L 80,130 L 160,135 L 240,110 L 320,95 L 400,85 L 480,70 L 560,60 L 600,55 L 600,180 L 0,180 Z"
            fill={`${theme.accent}15`} />
          <polyline points="0,140 80,130 160,135 240,110 320,95 400,85 480,70 560,60 600,55"
            fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" />
          {[[0, 140], [80, 130], [160, 135], [240, 110], [320, 95], [400, 85], [480, 70], [560, 60]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={theme.surface} stroke={theme.accent} strokeWidth="2.5" />
          ))}
        </svg>
        <p className="serif" style={{ color: theme.inkSoft, fontSize: 17, marginTop: 16, marginBottom: 0, fontStyle: 'italic' }}>
          "Your confidence scores climbed most this week. Keep going."
        </p>
      </div>
    </div>
  );
}
