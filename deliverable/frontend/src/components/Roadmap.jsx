import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const DEFAULT_WEEKS = [
  { num: 1, label: 'Foundation', tasks: [
    { id: 'w1-1', title: 'Research Spotify product principles', type: 'Research', time: '30m' },
    { id: 'w1-2', title: 'Review your past projects for STAR stories', type: 'Practice', time: '45m' },
    { id: 'w1-3', title: 'Practice three behavioural questions', type: 'Practice', time: '60m' },
  ]},
  { num: 2, label: 'Depth', tasks: [
    { id: 'w2-1', title: 'Study product metrics & A/B testing', type: 'Research', time: '60m' },
    { id: 'w2-2', title: 'Mock interview: product sense', type: 'Practice', time: '45m' },
    { id: 'w2-3', title: 'Update CV with two quantified outcomes', type: 'Polish', time: '30m' },
  ]},
  { num: 3, label: 'Polish', tasks: [
    { id: 'w3-1', title: 'Full panel mock simulation', type: 'Practice', time: '60m' },
    { id: 'w3-2', title: 'Prepare five questions for them', type: 'Research', time: '20m' },
  ]},
];

const DEFAULT_FOCUS_AREAS = [
  { num: '01', title: 'Behavioural questions', priority: 'High' },
  { num: '02', title: 'Data literacy', priority: 'Medium' },
  { num: '03', title: 'Stakeholder management', priority: 'Low' },
];

const DEFAULT_SKILL_GAPS = [
  { skill: 'Product strategy', match: 85 },
  { skill: 'User research', match: 72 },
  { skill: 'Data analytics', match: 45 },
  { skill: 'Stakeholder management', match: 68 },
  { skill: 'Roadmapping', match: 38 },
];

export default function Roadmap({ theme, mono, setPage, roadmapData }) {
  const weeks = roadmapData?.weeks || DEFAULT_WEEKS;
  const focusAreas = roadmapData?.focus_areas || DEFAULT_FOCUS_AREAS;
  const skillGaps = roadmapData?.skill_gaps || DEFAULT_SKILL_GAPS;
  const role = roadmapData ? `${roadmapData.company} · ${roadmapData.role}` : 'Spotify · Product Manager';
  const daysLabel = roadmapData?.days_to_interview ? `${roadmapData.days_to_interview} days.` : 'Eleven days.';

  const initialTasks = {};
  weeks.forEach((w, wi) => w.tasks.forEach((t, ti) => {
    initialTasks[t.id] = wi === 0 && ti < 2;
  }));

  const [tasks, setTasks] = useState(initialTasks);
  const toggle = (id) => setTasks(t => ({ ...t, [id]: !t[id] }));
  const total = Object.keys(tasks).length;
  const done = Object.values(tasks).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ padding: '48px 40px', maxWidth: 1240, margin: '0 auto' }} className="fade-up">
      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 28, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            The Roadmap · {role}
          </div>
          <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {daysLabel} <em style={{ color: theme.accent }}>Three weeks.</em>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="serif" style={{ fontSize: 56, fontWeight: 600, color: theme.accent, lineHeight: 1 }}>{pct}%</div>
          <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>COMPLETE</div>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>
        Three areas to focus on
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {focusAreas.map((f, i) => {
          const color = f.priority === 'High' ? theme.error : f.priority === 'Medium' ? theme.warning : theme.success;
          return (
            <div key={i} className="card-hover" style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <span className="mono" style={{ fontSize: 11, color: theme.accent }}>{f.num}</span>
                <span className="mono" style={{ fontSize: 10, padding: '3px 8px', background: color, color: theme.bg, letterSpacing: '0.08em' }}>
                  {f.priority.toUpperCase()}
                </span>
              </div>
              <h4 className="serif" style={{ margin: 0, fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}>{f.title}</h4>
            </div>
          );
        })}
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 20 }}>
        Week by Week
      </div>
      <div style={{ position: 'relative', paddingLeft: 40 }}>
        <div style={{ position: 'absolute', left: 12, top: 12, bottom: 12, width: 1, background: theme.rule }} />
        {weeks.map(w => (
          <div key={w.num} style={{ marginBottom: 32, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: -40, top: 4,
              width: 24, height: 24, borderRadius: '50%',
              background: theme.ink, color: theme.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12,
            }}>{w.num}</div>
            <h4 className="serif" style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 500 }}>
              Week {w.num} <span style={{ color: theme.inkFaint, fontStyle: 'italic' }}>· {w.label}</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {w.tasks.map(t => (
                <div key={t.id} style={{
                  background: theme.surface, border: `1px solid ${theme.rule}`,
                  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <button onClick={() => toggle(t.id)} aria-label={tasks[t.id] ? 'Mark incomplete' : 'Mark complete'}>
                    {tasks[t.id] ? <CheckCircle2 size={20} color={theme.success} /> : <Circle size={20} color={theme.inkFaint} />}
                  </button>
                  <span style={{ flex: 1, fontSize: 15, textDecoration: tasks[t.id] ? 'line-through' : 'none', color: tasks[t.id] ? theme.inkFaint : theme.ink }}>{t.title}</span>
                  <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.type}</span>
                  <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, minWidth: 36, textAlign: 'right' }}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginTop: 32, marginBottom: 16 }}>
        Skill Match
      </div>
      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
        {skillGaps.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 80px', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < skillGaps.length - 1 ? `1px solid ${theme.surfaceAlt}` : 'none' }}>
            <span className="serif" style={{ fontSize: 17 }}>{s.skill}</span>
            <div style={{ background: theme.surfaceAlt, height: 6 }}>
              <div style={{ width: `${s.match}%`, height: '100%', background: s.match < 50 ? theme.warning : theme.success, transition: 'width 0.4s' }} />
            </div>
            <span className="mono" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right', color: s.match < 50 ? theme.warning : theme.ink }}>
              {s.match}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
