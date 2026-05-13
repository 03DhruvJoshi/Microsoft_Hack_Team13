import React, { useState, useEffect } from 'react';
import { Download, Calendar, CheckCircle, Loader } from 'lucide-react';
import { API_BASE } from '../constants';

export default function CalendarSync({ theme, mono, setPage, roadmapData }) {
  const [duration, setDuration] = useState(45);
  const [days, setDays] = useState(3);
  const [times, setTimes] = useState({ morning: false, afternoon: true, evening: true });
  const [exported, setExported] = useState(false);
  const [msStatus, setMsStatus] = useState({ configured: false, connected: false });
  const [msSyncing, setMsSyncing] = useState(false);
  const [msSynced, setMsSynced] = useState(false);
  const [msError, setMsError] = useState('');

  // Check Microsoft Calendar connection status + ?ms_connected redirect
  useEffect(() => {
    fetch(`${API_BASE}/api/microsoft/status`)
      .then(r => r.json())
      .then(d => setMsStatus(d))
      .catch(() => {});

    if (new URLSearchParams(window.location.search).get('ms_connected') === 'true') {
      setMsStatus(s => ({ ...s, connected: true }));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ── Backend ICS download (uses real roadmap data) ────────────
  const downloadFromBackend = async () => {
    if (!roadmapData) return downloadFallback();
    try {
      const res = await fetch(`${API_BASE}/api/calendar/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmap_data: roadmapData,
          interview_date: roadmapData.interview_date || '',
        }),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const blob = await res.blob();
      triggerDownload(blob, 'preppath_schedule.ics');
      setExported(true);
    } catch {
      downloadFallback();
    }
  };

  // ── Client-side ICS fallback (generic sessions) ──────────────
  const downloadFallback = () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fmt = d =>
      d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';

    const baseHours = [];
    if (times.morning)   baseHours.push(9);
    if (times.afternoon) baseHours.push(14);
    if (times.evening)   baseHours.push(18);
    if (baseHours.length === 0) baseHours.push(14);

    const titles = [
      'Research: company background & culture',
      'Practice: STAR story development',
      'Practice: behavioural questions',
      'Research: role-specific skills',
      'Practice: product / technical mock',
      'Polish: CV and talking points',
      'Practice: full panel simulation',
      'Research: questions for interviewers',
    ];

    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//PrepPath//Interview Prep//EN\r\nCALSCALE:GREGORIAN\r\n';
    const total = Math.min(days * 3, titles.length);
    let count = 0;
    for (let week = 0; week < 3 && count < total; week++) {
      const sessionsThisWeek = Math.min(days, total - count);
      for (let i = 0; i < sessionsThisWeek; i++) {
        const dayOffset = week * 7 + Math.floor((i / days) * 5) + i + 1;
        const hour = baseHours[i % baseHours.length];
        const start = new Date(now);
        start.setDate(now.getDate() + dayOffset);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + duration);
        ics += 'BEGIN:VEVENT\r\n';
        ics += `UID:preppath-${count}-${now.getTime()}@preppath.app\r\n`;
        ics += `DTSTAMP:${fmt(now)}\r\nDTSTART:${fmt(start)}\r\nDTEND:${fmt(end)}\r\n`;
        ics += `SUMMARY:PrepPath: ${titles[count]}\r\n`;
        ics += 'BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:PrepPath session in 1 hour\r\nTRIGGER:-PT1H\r\nEND:VALARM\r\n';
        ics += 'END:VEVENT\r\n';
        count++;
      }
    }
    ics += 'END:VCALENDAR\r\n';
    triggerDownload(new Blob([ics], { type: 'text/calendar;charset=utf-8' }), 'preppath-sessions.ics');
    setExported(true);
  };

  const triggerDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Microsoft Calendar sync ───────────────────────────────────
  const connectMicrosoft = () => {
    window.location.href = `${API_BASE}/api/microsoft/auth`;
  };

  const syncToMicrosoft = async () => {
    if (!roadmapData) { setMsError('No roadmap data. Complete onboarding first.'); return; }
    setMsSyncing(true); setMsError('');
    try {
      const res = await fetch(`${API_BASE}/api/microsoft/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmap_data: roadmapData, interview_date: roadmapData.interview_date || '' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server ${res.status}`);
      }
      const { message } = await res.json();
      setMsSynced(true);
      setMsError('');
      console.log(message);
    } catch (err) {
      setMsError(err.message);
    } finally {
      setMsSyncing(false);
    }
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
          Export your personalised prep sessions, built from your actual roadmap, to any calendar.
        </p>
      </div>

      {/* Session preferences */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 32, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 20 }}>Session Preferences</div>

        <div style={{ marginBottom: 28 }}>
          <label className="serif" style={{ fontSize: 22, fontWeight: 500, display: 'block', marginBottom: 12 }}>How long per session?</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[20, 30, 45, 60].map(d => (
              <button key={d} onClick={() => setDuration(d)} className="mono" style={{ flex: 1, padding: '14px 0', fontSize: 13, letterSpacing: '0.05em', background: duration === d ? theme.ink : 'transparent', color: duration === d ? theme.bg : theme.ink, border: `1px solid ${theme.rule}`, fontWeight: 500 }}>{d} MIN</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="serif" style={{ fontSize: 22, fontWeight: 500, display: 'block', marginBottom: 12 }}>Preferred times</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: 'morning', label: 'Morning', sub: '7–12' }, { id: 'afternoon', label: 'Afternoon', sub: '12–17' }, { id: 'evening', label: 'Evening', sub: '17–21' }].map(t => (
              <button key={t.id} onClick={() => setTimes(prev => ({ ...prev, [t.id]: !prev[t.id] }))} style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: times[t.id] ? theme.ink : 'transparent', color: times[t.id] ? theme.bg : theme.ink, border: `1px solid ${theme.rule}` }}>
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

      {/* Stats */}
      <div style={{ background: theme.ink, color: theme.bg, padding: 28, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>What you'll get</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { val: roadmapData ? roadmapData.weeks?.reduce((a, w) => a + (w.tasks?.length || 0), 0) : Math.min(days * 3, 8), unit: 'SESSIONS' },
            { val: `${duration}`, unit: 'MINS EACH', suffix: 'm' },
            { val: '3', unit: 'WEEK SPREAD', suffix: 'w' },
          ].map(({ val, unit, suffix }) => (
            <div key={unit}>
              <div className="serif" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{val}{suffix && <span style={{ fontSize: 18, color: theme.inkFaint }}>{suffix}</span>}</div>
              <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>{unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download ICS */}
      <button onClick={roadmapData ? downloadFromBackend : downloadFallback} style={{
        width: '100%', padding: 20, background: theme.accent, color: theme.bg,
        fontWeight: 600, fontSize: 16, letterSpacing: '0.02em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginBottom: 12,
      }}>
        <Download size={20} />
        {roadmapData
          ? (exported ? 'Re-download personalised .ics' : 'Download personalised calendar (.ics)')
          : (exported ? 'Re-download .ics file' : 'Download calendar file (.ics)')}
      </button>

      {/* Microsoft Calendar */}
      <div style={{ border: `1px solid ${theme.rule}`, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 4 }}>Microsoft Calendar</div>
            <p style={{ margin: 0, fontSize: 14, color: theme.inkSoft }}>Sync your roadmap events directly to Outlook / Microsoft 365.</p>
          </div>
          {msStatus.connected && <CheckCircle size={20} color={theme.success} />}
        </div>

        {msError && (
          <p style={{ fontSize: 13, color: theme.error, margin: '0 0 12px' }}>{msError}</p>
        )}

        {!msStatus.configured && (
          <p className="mono" style={{ fontSize: 11, color: theme.inkFaint, margin: '0 0 12px', letterSpacing: '0.05em' }}>
            Configure MS_CLIENT_ID in .env to enable Microsoft Calendar sync.
          </p>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          {!msStatus.connected ? (
            <button
              onClick={connectMicrosoft}
              disabled={!msStatus.configured}
              style={{ padding: '12px 20px', background: msStatus.configured ? '#0078d4' : theme.surfaceAlt, color: msStatus.configured ? '#fff' : theme.inkFaint, fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, opacity: msStatus.configured ? 1 : 0.6 }}
            >
              <Calendar size={16} /> Connect Microsoft Calendar
            </button>
          ) : (
            <button
              onClick={syncToMicrosoft}
              disabled={msSyncing || msSynced}
              style={{ padding: '12px 20px', background: msSynced ? theme.success : '#0078d4', color: '#fff', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, opacity: msSyncing ? 0.7 : 1 }}
            >
              {msSyncing ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Syncing…</>
                : msSynced ? <><CheckCircle size={14} /> Synced!</>
                : <><Calendar size={16} /> Sync to Microsoft Calendar</>}
            </button>
          )}
        </div>
      </div>

      {exported && (
        <div style={{ padding: 24, background: `${theme.success}15`, borderLeft: `3px solid ${theme.success}` }} className="fade-up">
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Downloaded.</div>
          <p style={{ margin: 0, color: theme.inkSoft, fontSize: 14, lineHeight: 1.6 }}>
            Open <span className="mono" style={{ fontSize: 13, background: theme.surfaceAlt, padding: '2px 8px' }}>preppath_schedule.ics</span> to import all sessions, with 1-hour reminders.
          </p>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkFaint, marginTop: 16 }}>
            Works with → Apple Calendar · Google Calendar · Outlook · Fantastical
          </div>
        </div>
      )}
    </div>
  );
}
