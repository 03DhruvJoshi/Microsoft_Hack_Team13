import React, { useState } from 'react';
import { Download } from 'lucide-react';

export default function CalendarSync({ theme, mono, setPage }) {
  const [duration, setDuration] = useState(45);
  const [days, setDays] = useState(3);
  const [exported, setExported] = useState(false);
  const [times, setTimes] = useState({ morning: false, afternoon: true, evening: true });

  const generateICS = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formatDate = (d) =>
      d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';

    const baseHours = [];
    if (times.morning) baseHours.push(9);
    if (times.afternoon) baseHours.push(14);
    if (times.evening) baseHours.push(18);
    if (baseHours.length === 0) baseHours.push(14);

    const sessionTitles = [
      'Research: Spotify product principles',
      'Practice: STAR story development',
      'Practice: behavioural questions',
      'Research: product metrics & A/B testing',
      'Practice: product sense mock',
      'Polish: CV quantified outcomes',
      'Practice: full panel simulation',
      'Research: questions for interviewers',
    ];

    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//PrepPath//Interview Prep//EN\r\nCALSCALE:GREGORIAN\r\n';
    let sessionCount = 0;
    const totalSessions = Math.min(days * 3, sessionTitles.length);

    for (let week = 0; week < 3 && sessionCount < totalSessions; week++) {
      const sessionsThisWeek = Math.min(days, totalSessions - sessionCount);
      for (let i = 0; i < sessionsThisWeek; i++) {
        const dayOffset = week * 7 + Math.floor((i / days) * 5) + i + 1;
        const hour = baseHours[i % baseHours.length];

        const start = new Date(now);
        start.setDate(now.getDate() + dayOffset);
        start.setHours(hour, 0, 0, 0);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + duration);

        const uid = `preppath-${sessionCount}-${now.getTime()}@preppath.app`;
        const title = sessionTitles[sessionCount];

        ics += 'BEGIN:VEVENT\r\n';
        ics += `UID:${uid}\r\n`;
        ics += `DTSTAMP:${formatDate(now)}\r\n`;
        ics += `DTSTART:${formatDate(start)}\r\n`;
        ics += `DTEND:${formatDate(end)}\r\n`;
        ics += `SUMMARY:PrepPath — ${title}\r\n`;
        ics += `DESCRIPTION:Interview prep session for your Spotify Product Manager interview.\\n\\nFocus: ${title}\\n\\nOpen PrepPath when ready to begin.\r\n`;
        ics += 'BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:PrepPath session starting in 1 hour\r\nTRIGGER:-PT1H\r\nEND:VALARM\r\n';
        ics += 'END:VEVENT\r\n';
        sessionCount++;
      }
    }

    ics += 'END:VCALENDAR\r\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preppath-sessions.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
  };

  return (
    <div style={{ padding: '48px 40px', maxWidth: 880, margin: '0 auto' }} className="fade-up">
      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 28, marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Calendar · Phase Two
        </div>
        <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
          Bring it <em>into your week</em>.
        </h1>
        <p style={{ fontSize: 17, color: theme.inkSoft, marginTop: 16, maxWidth: 540 }}>
          Export your prep sessions as a calendar file. Drop it into Apple Calendar, Google Calendar, Outlook — anything that opens .ics.
        </p>
      </div>

      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 32, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 20 }}>
          Session Preferences
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="serif" style={{ fontSize: 22, fontWeight: 500, display: 'block', marginBottom: 12 }}>How long per session?</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[20, 30, 45, 60].map(d => (
              <button key={d} onClick={() => setDuration(d)} className="mono" style={{
                flex: 1, padding: '14px 0', fontSize: 13, letterSpacing: '0.05em',
                background: duration === d ? theme.ink : 'transparent',
                color: duration === d ? theme.bg : theme.ink,
                border: `1px solid ${theme.rule}`,
                fontWeight: 500,
              }}>{d} MIN</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="serif" style={{ fontSize: 22, fontWeight: 500, display: 'block', marginBottom: 12 }}>Preferred times</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'morning', label: 'Morning', sub: '7–12' },
              { id: 'afternoon', label: 'Afternoon', sub: '12–17' },
              { id: 'evening', label: 'Evening', sub: '17–21' },
            ].map(t => (
              <button key={t.id} onClick={() => setTimes(prev => ({ ...prev, [t.id]: !prev[t.id] }))} style={{
                flex: 1, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: times[t.id] ? theme.ink : 'transparent',
                color: times[t.id] ? theme.bg : theme.ink,
                border: `1px solid ${theme.rule}`,
              }}>
                <span className="serif" style={{ fontSize: 18, fontWeight: 500 }}>{t.label}</span>
                <span className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{t.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="serif" style={{ fontSize: 22, fontWeight: 500, display: 'block', marginBottom: 12 }}>Days per week</label>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 24, border: `1px solid ${theme.rule}`, padding: '10px 20px' }}>
            <button onClick={() => setDays(Math.max(1, days - 1))} className="serif" style={{ padding: 4, fontWeight: 700, fontSize: 28, color: theme.inkFaint }}>−</button>
            <span className="serif" style={{ minWidth: 40, textAlign: 'center', fontWeight: 600, fontSize: 32 }}>{days}</span>
            <button onClick={() => setDays(Math.min(7, days + 1))} className="serif" style={{ padding: 4, fontWeight: 700, fontSize: 28, color: theme.inkFaint }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ background: theme.ink, color: theme.bg, padding: 28, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>
          What you'll get
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{Math.min(days * 3, 8)}</div>
            <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>SESSIONS</div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{duration}<span style={{ fontSize: 18, color: theme.inkFaint }}>m</span></div>
            <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>EACH</div>
          </div>
          <div>
            <div className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>3<span style={{ fontSize: 18, color: theme.inkFaint }}>w</span></div>
            <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>SPREAD</div>
          </div>
        </div>
      </div>

      <button onClick={generateICS} style={{
        width: '100%', padding: 20,
        background: theme.accent, color: theme.bg,
        fontWeight: 600, fontSize: 16, letterSpacing: '0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <Download size={20} /> {exported ? 'Re-download .ics file' : 'Download calendar file (.ics)'}
      </button>

      {exported && (
        <div style={{ marginTop: 20, padding: 24, background: `${theme.success}15`, borderLeft: `3px solid ${theme.success}` }} className="fade-up">
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Downloaded.</div>
          <p style={{ margin: 0, color: theme.inkSoft, fontSize: 14, lineHeight: 1.6 }}>
            Open <span className="mono" style={{ fontSize: 13, background: theme.surfaceAlt, padding: '2px 8px' }}>preppath-sessions.ics</span> on your device. Your calendar app will offer to import all sessions — including a 1-hour reminder before each one.
          </p>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkFaint, marginTop: 16 }}>
            Works with → Apple Calendar · Google Calendar · Outlook · Fantastical
          </div>
        </div>
      )}
    </div>
  );
}
