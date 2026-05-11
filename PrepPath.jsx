import React, { useState, useEffect } from 'react';
import { 
  Accessibility, X, FileText, Briefcase, Calendar as CalIcon, Mic, BarChart3, 
  CheckCircle2, Circle, ChevronRight, ChevronLeft, Bell, Pause, 
  RotateCcw, Sparkles, TrendingUp, Clock, Upload, ArrowLeft, Download,
  ChevronDown, ChevronUp, Plus, Target
} from 'lucide-react';

export default function PrepPath() {
  const [page, setPage] = useState('landing');
  const [a11yOpen, setA11yOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSize, setTextSize] = useState(16);

  // Editorial theme tokens — warm cream by default, true black/white in HC mode
  const theme = highContrast ? {
    bg: '#000000', surface: '#0A0A0A', surfaceAlt: '#1A1A1A',
    ink: '#FFFFFF', inkSoft: '#D4D4D4', inkFaint: '#888888',
    accent: '#FFD60A', accentSoft: '#FFE85533',
    rule: '#FFFFFF', success: '#4ADE80', warning: '#FBBF24', error: '#FF6B6B',
  } : {
    bg: '#F4F1EA', surface: '#FFFEFA', surfaceAlt: '#EDE8DD',
    ink: '#1C1C1C', inkSoft: '#3A3A3A', inkFaint: '#7A756B',
    accent: '#E8553D', accentSoft: '#E8553D22',
    rule: '#1C1C1C', success: '#5B7A3D', warning: '#C4843A', error: '#B0382A',
  };

  const fontFamily = dyslexiaFont 
    ? "'OpenDyslexic', 'Comic Sans MS', sans-serif"
    : "'Inter', system-ui, sans-serif";
  
  const serif = dyslexiaFont
    ? "'OpenDyslexic', 'Comic Sans MS', sans-serif"
    : "'Fraunces', Georgia, serif";

  const mono = "'JetBrains Mono', ui-monospace, monospace";
  const transition = reduceMotion ? 'none' : 'all 0.2s ease';

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.ink,
      fontFamily,
      fontSize: `${textSize}px`,
      lineHeight: 1.6,
      letterSpacing: '0.005em',
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top left',
      width: `${10000 / zoom}%`,
      transition,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.cdnfonts.com/css/opendyslexic');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; font-size: inherit; }
        input, textarea, select { font-family: inherit; font-size: inherit; }
        button:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 3px solid ${theme.accent}; outline-offset: 2px;
        }
        .serif { font-family: ${serif}; letter-spacing: -0.02em; }
        .mono { font-family: ${mono}; }
        .grain {
          position: fixed; inset: 0; pointer-events: none; opacity: ${highContrast ? 0 : 0.04}; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 ${theme.accent}88; } 70% { box-shadow: 0 0 0 16px ${theme.accent}00; } 100% { box-shadow: 0 0 0 0 ${theme.accent}00; } }
        @keyframes wave { 0%, 100% { height: 8px; } 50% { height: 28px; } }
        .fade-up { animation: ${reduceMotion ? 'none' : 'fadeUp 0.5s ease forwards'}; }
        .card-hover { transition: ${transition}; }
        .card-hover:hover { transform: ${reduceMotion ? 'none' : 'translateY(-2px)'}; box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      `}</style>

      <div className="grain" />

      {page !== 'landing' && page !== 'onboarding' && (
        <Header page={page} setPage={setPage} theme={theme} mono={mono} />
      )}

      <AccessibilityToolbar
        open={a11yOpen} setOpen={setA11yOpen}
        zoom={zoom} setZoom={setZoom}
        highContrast={highContrast} setHighContrast={setHighContrast}
        dyslexiaFont={dyslexiaFont} setDyslexiaFont={setDyslexiaFont}
        reduceMotion={reduceMotion} setReduceMotion={setReduceMotion}
        textSize={textSize} setTextSize={setTextSize}
        theme={theme} mono={mono} transition={transition}
      />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {page === 'landing' && <Landing theme={theme} mono={mono} setPage={setPage} />}
        {page === 'onboarding' && <Onboarding theme={theme} mono={mono} setPage={setPage} />}
        {page === 'dashboard' && <Dashboard theme={theme} mono={mono} setPage={setPage} />}
        {page === 'roadmap' && <Roadmap theme={theme} mono={mono} setPage={setPage} />}
        {page === 'calendar' && <CalendarSync theme={theme} mono={mono} setPage={setPage} />}
        {page === 'practice' && <Practice theme={theme} mono={mono} setPage={setPage} />}
        {page === 'feedback' && <Feedback theme={theme} mono={mono} setPage={setPage} />}
      </main>
    </div>
  );
}

/* ---------- HEADER ---------- */
function Header({ page, setPage, theme, mono }) {
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

/* ---------- ACCESSIBILITY TOOLBAR ---------- */
function AccessibilityToolbar({ open, setOpen, zoom, setZoom, highContrast, setHighContrast, 
  dyslexiaFont, setDyslexiaFont, reduceMotion, setReduceMotion, textSize, setTextSize, theme, mono, transition }) {
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

          <ToggleRow label="High contrast" value={highContrast} onChange={setHighContrast} theme={theme} mono={mono} activeColor="#FFD60A" />
          <ToggleRow label="Dyslexia-friendly font" value={dyslexiaFont} onChange={setDyslexiaFont} theme={theme} mono={mono} />
          <ToggleRow label="Reduce motion" value={reduceMotion} onChange={setReduceMotion} theme={theme} mono={mono} />

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

function ToggleRow({ label, value, onChange, theme, mono, activeColor }) {
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

/* ---------- LANDING ---------- */
function Landing({ theme, mono, setPage }) {
  return (
    <div className="fade-up">
      <section style={{ padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <span className="serif" style={{ fontSize: 32, fontWeight: 700 }}>PrepPath<span style={{ color: theme.accent }}>.</span></span>
          <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase' }}>Issue №07</span>
        </div>

        <div style={{ borderTop: `1px solid ${theme.rule}`, paddingTop: 40 }}>
          <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>
            The Cover Story · Built for every student
          </div>
          <h1 className="serif" style={{ fontSize: 92, fontWeight: 500, margin: 0, lineHeight: 0.95, letterSpacing: '-0.04em', maxWidth: 1000 }}>
            Your interview.<br />
            Your pace.<br />
            <span style={{ fontStyle: 'italic', color: theme.inkFaint }}>Your plan.</span>
          </h1>
          <p style={{ fontSize: 19, color: theme.inkSoft, maxWidth: 560, marginTop: 32, lineHeight: 1.5 }}>
            AI-powered interview prep that adapts to your schedule, your needs, and your goals. Designed with — not for — neurodivergent students.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button onClick={() => setPage('onboarding')} style={{
              padding: '18px 32px', background: theme.ink, color: theme.bg,
              fontWeight: 500, fontSize: 15, letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Begin <ChevronRight size={18} />
            </button>
            <button onClick={() => setPage('dashboard')} className="mono" style={{
              padding: '18px 24px', background: 'transparent',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              border: `1px solid ${theme.rule}`,
            }}>
              See the demo →
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto', borderTop: `1px solid ${theme.rule}` }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 32 }}>
          Inside this issue · Three columns
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            { num: '01', title: 'A roadmap, not a wish.', desc: 'Upload your CV and a job description. The AI builds a week-by-week plan with the gaps you need to close.' },
            { num: '02', title: 'Practice with a mirror.', desc: 'Record mock answers. Get honest feedback on filler words, confidence, timing, and whether you actually answered the question.' },
            { num: '03', title: 'Calendar on your terms.', desc: 'Export every session as an .ics file. Drop it into Google, Apple, or Outlook. No accounts to connect, no permissions to grant.' },
          ].map((f, i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize: 11, color: theme.accent, marginBottom: 12, letterSpacing: '0.08em' }}>{f.num}</div>
              <h3 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.1 }}>{f.title}</h3>
              <p style={{ color: theme.inkSoft, margin: 0, lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${theme.rule}`, marginTop: 40, padding: '32px 40px', maxWidth: 1200, margin: '40px auto 0', display: 'flex', justifyContent: 'space-between' }} className="mono">
        <span style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase' }}>PrepPath · MMXXVI · Made with care</span>
        <span style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase' }}>Privacy · Accessibility · Contact</span>
      </footer>
    </div>
  );
}

/* ---------- ONBOARDING ---------- */
function Onboarding({ theme, mono, setPage }) {
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [jdText, setJdText] = useState('');
  const [date, setDate] = useState('');

  const handleAnalyse = () => {
    setLoading(true);
    [1, 2, 3, 4].forEach((s, i) => {
      setTimeout(() => setLoadStep(s), (i + 1) * 700);
    });
    setTimeout(() => setPage('roadmap'), 3500);
  };

  if (loading) {
    const steps = ['Reading your CV', 'Analysing the job description', 'Identifying skill gaps', 'Building your roadmap'];
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }} className="fade-up">
        <div className="serif" style={{ fontSize: 56, fontWeight: 500, fontStyle: 'italic', color: theme.inkFaint, marginBottom: 40 }}>
          one moment.
        </div>
        <div style={{ width: 380 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0',
              borderBottom: i < steps.length - 1 ? `1px solid ${theme.rule}` : 'none',
              opacity: i <= loadStep ? 1 : 0.25,
              transition: 'opacity 0.3s',
            }}>
              <span className="mono" style={{ fontSize: 11, color: theme.inkFaint, width: 24 }}>0{i + 1}</span>
              <span style={{ flex: 1, fontSize: 15 }}>{step}</span>
              {i < loadStep ? <CheckCircle2 size={18} color={theme.success} /> 
                : i === loadStep ? <div style={{ width: 14, height: 14, border: `2px solid ${theme.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'pulse 1s linear infinite' }} />
                : <Circle size={18} color={theme.inkFaint} />}
            </div>
          ))}
        </div>
        <p className="mono" style={{ color: theme.inkFaint, marginTop: 32, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>This takes about 15 seconds</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 40px 80px', maxWidth: 1000, margin: '0 auto' }} className="fade-up">
      <button onClick={() => setPage('landing')} className="mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        <ArrowLeft size={14} /> Back to home
      </button>

      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 28, marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Chapter One · The beginning
        </div>
        <h1 className="serif" style={{ fontSize: 64, fontWeight: 500, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
          Let's build your <em>prep plan</em>.
        </h1>
        <p style={{ fontSize: 18, color: theme.inkSoft, marginTop: 16, maxWidth: 560 }}>
          Upload your CV and the job description. We'll handle the rest.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <FileText size={18} />
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>01 — Your CV</span>
          </div>
          <button onClick={() => setCvUploaded(!cvUploaded)} style={{
            width: '100%', padding: 36,
            border: `2px dashed ${cvUploaded ? theme.success : theme.rule}`,
            background: cvUploaded ? `${theme.success}10` : 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            {cvUploaded ? (
              <>
                <CheckCircle2 size={28} color={theme.success} />
                <span style={{ fontWeight: 600 }}>DanielThompson_CV.pdf</span>
                <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Click to remove</span>
              </>
            ) : (
              <>
                <Upload size={26} color={theme.inkFaint} />
                <span className="serif" style={{ fontSize: 18, fontStyle: 'italic' }}>Drop your CV here</span>
                <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>PDF or DOCX · Max 5MB</span>
              </>
            )}
          </button>
        </div>

        <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Briefcase size={18} />
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>02 — Job Description</span>
          </div>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the full job description here…"
            style={{
              width: '100%', minHeight: 132, padding: 14,
              border: `1px solid ${theme.rule}`,
              background: theme.bg, color: theme.ink, resize: 'vertical',
              fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <CalIcon size={18} />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>03 — Interview date <span style={{ color: theme.inkFaint }}>(optional)</span></span>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
          padding: 12, border: `1px solid ${theme.rule}`,
          background: theme.bg, color: theme.ink, fontSize: 14,
        }} />
        {date && (
          <div style={{ marginTop: 16, padding: '14px 18px', background: theme.accentSoft, borderLeft: `3px solid ${theme.accent}`, fontSize: 14 }}>
            We'll finish your prep plan two days before this date.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleAnalyse} disabled={!cvUploaded || !jdText} style={{
          padding: '18px 32px',
          background: (cvUploaded && jdText) ? theme.ink : theme.inkFaint,
          color: theme.bg, fontWeight: 500, fontSize: 15, letterSpacing: '0.02em',
          opacity: (cvUploaded && jdText) ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: (cvUploaded && jdText) ? 'pointer' : 'not-allowed',
        }}>
          Analyse & build my plan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------- DASHBOARD ---------- */
function Dashboard({ theme, mono, setPage }) {
  return (
    <div style={{ padding: '48px 40px', maxWidth: 1240, margin: '0 auto' }} className="fade-up">
      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 32, marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Dashboard · Welcome back, Daniel
        </div>
        <h1 className="serif" style={{ fontSize: 64, fontWeight: 500, margin: 0, lineHeight: 0.98, letterSpacing: '-0.03em' }}>
          You're <em>58%</em> there.
        </h1>
        <p style={{ fontSize: 17, color: theme.inkSoft, marginTop: 16, maxWidth: 540 }}>
          Eleven days until your Spotify interview. Keep the momentum.
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
          {[[0,140],[80,130],[160,135],[240,110],[320,95],[400,85],[480,70],[560,60]].map(([x,y], i) => (
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

/* ---------- ROADMAP ---------- */
function Roadmap({ theme, mono, setPage }) {
  const [tasks, setTasks] = useState({
    'w1-1': true, 'w1-2': true, 'w1-3': false,
    'w2-1': false, 'w2-2': false, 'w2-3': false,
    'w3-1': false, 'w3-2': false,
  });
  const toggle = (id) => setTasks(t => ({ ...t, [id]: !t[id] }));
  const total = Object.keys(tasks).length;
  const done = Object.values(tasks).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const weeks = [
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

  return (
    <div style={{ padding: '48px 40px', maxWidth: 1240, margin: '0 auto' }} className="fade-up">
      <div style={{ borderBottom: `1px solid ${theme.rule}`, paddingBottom: 28, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            The Roadmap · Spotify · Product Manager
          </div>
          <h1 className="serif" style={{ fontSize: 56, fontWeight: 500, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
            Eleven days. <em style={{ color: theme.accent }}>Three weeks.</em>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="serif" style={{ fontSize: 56, fontWeight: 600, color: theme.accent, lineHeight: 1 }}>{pct}%</div>
          <div className="mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: '0.1em', marginTop: 4 }}>COMPLETE</div>
        </div>
      </div>

      {/* Focus areas */}
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>
        Three areas to focus on
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { num: '01', title: 'Behavioural questions', priority: 'High', color: theme.error },
          { num: '02', title: 'Data literacy', priority: 'Medium', color: theme.warning },
          { num: '03', title: 'Stakeholder management', priority: 'Low', color: theme.success },
        ].map((f, i) => (
          <div key={i} className="card-hover" style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <span className="mono" style={{ fontSize: 11, color: theme.accent }}>{f.num}</span>
              <span className="mono" style={{ fontSize: 10, padding: '3px 8px', background: f.color, color: theme.bg, letterSpacing: '0.08em' }}>
                {f.priority.toUpperCase()}
              </span>
            </div>
            <h4 className="serif" style={{ margin: 0, fontSize: 24, fontWeight: 500, lineHeight: 1.1 }}>{f.title}</h4>
          </div>
        ))}
      </div>

      {/* Timeline */}
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

      {/* Skill gaps */}
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginTop: 32, marginBottom: 16 }}>
        Skill Match
      </div>
      <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
        {[
          { skill: 'Product strategy', match: 85 },
          { skill: 'User research', match: 72 },
          { skill: 'Data analytics', match: 45 },
          { skill: 'Stakeholder management', match: 68 },
          { skill: 'Roadmapping', match: 38 },
        ].map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 80px', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < 4 ? `1px solid ${theme.surfaceAlt}` : 'none' }}>
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

/* ---------- CALENDAR — REAL .ics EXPORT ---------- */
function CalendarSync({ theme, mono, setPage }) {
  const [duration, setDuration] = useState(45);
  const [days, setDays] = useState(3);
  const [exported, setExported] = useState(false);
  const [times, setTimes] = useState({ morning: false, afternoon: true, evening: true });

  // Generate real .ics file
  const generateICS = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formatDate = (d) => {
      return d.getUTCFullYear() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) + 'Z';
    };

    // Build sessions: pick a base hour per preferred slot
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

    // Generate sessions across the next 3 weeks
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

      {/* Preview */}
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

/* ---------- PRACTICE ---------- */
function Practice({ theme, mono, setPage }) {
  const [recording, setRecording] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', minHeight: 'calc(100vh - 81px)' }} className="fade-up">
      <div style={{ background: theme.surfaceAlt, padding: '48px 40px', borderRight: `1px solid ${theme.rule}` }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Practice · Question 03 of 08
        </div>
        <span className="mono" style={{
          display: 'inline-block', padding: '4px 10px',
          background: theme.ink, color: theme.bg,
          fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
          marginBottom: 20,
        }}>BEHAVIOURAL</span>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.2, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
          "Tell me about a time you had to manage <em>multiple competing priorities</em>. How did you handle it?"
        </h2>

        <button onClick={() => setTipOpen(!tipOpen)} style={{
          width: '100%', padding: 16,
          background: theme.surface, border: `1px solid ${theme.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preparation tip</span>
          {tipOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {tipOpen && (
          <p style={{ padding: '16px 20px', background: theme.surface, border: `1px solid ${theme.rule}`, borderTop: 'none', margin: 0, fontSize: 14 }}>
            Use the STAR method. Aim for 90–120 seconds.
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 24 }}>
          {[
            { l: 'S', label: 'Situation' },
            { l: 'T', label: 'Task' },
            { l: 'A', label: 'Action' },
            { l: 'R', label: 'Result' },
          ].map(s => (
            <div key={s.l} style={{
              background: theme.surface, border: `1px solid ${theme.rule}`,
              padding: 16, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span className="serif" style={{
                fontSize: 28, fontWeight: 600, color: theme.accent, lineHeight: 1,
              }}>{s.l}</span>
              <span style={{ fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 480, aspectRatio: '16/10',
          background: theme.ink,
          border: recording ? `2px solid ${theme.accent}` : `1px solid ${theme.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
          animation: recording ? 'pulseRing 2s infinite' : 'none',
          color: theme.bg, position: 'relative',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: theme.accent, color: theme.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700,
          }}>DT</div>
          {recording && (
            <div className="mono" style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 6, background: theme.accent, color: theme.bg, padding: '4px 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
              <span style={{ width: 6, height: 6, background: theme.bg, borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              REC
            </div>
          )}
          {recording && (
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {[0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0].map((d, i) => (
                <div key={i} style={{
                  width: 4, height: 16, background: theme.accent,
                  animation: `wave 0.6s ${d}s infinite ease-in-out`,
                }} />
              ))}
            </div>
          )}
        </div>

        <div className="serif" style={{ marginTop: 32, fontSize: 72, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: recording ? theme.accent : theme.ink, lineHeight: 1 }}>
          {mm}:{ss}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button onClick={() => setRecording(!recording)} style={{
            padding: '16px 28px',
            background: recording ? theme.ink : theme.accent, color: theme.bg,
            fontWeight: 500, fontSize: 14, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {recording ? <><Pause size={16} /> STOP RECORDING</> : <><Mic size={16} /> START RECORDING</>}
          </button>
          {elapsed > 0 && !recording && (
            <>
              <button onClick={() => setElapsed(0)} className="mono" style={{
                padding: '16px 20px', border: `1px solid ${theme.rule}`,
                fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <RotateCcw size={14} /> Re-record
              </button>
              <button onClick={() => setPage('feedback')} style={{
                padding: '16px 24px', background: theme.ink, color: theme.bg,
                fontWeight: 500, fontSize: 14, letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                GET FEEDBACK <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        <p className="mono" style={{ fontSize: 10, color: theme.inkFaint, marginTop: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Processed locally · Never stored without consent
        </p>
      </div>
    </div>
  );
}

/* ---------- FEEDBACK ---------- */
function Feedback({ theme, mono, setPage }) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const score = 78;
  const scoreColor = score > 70 ? theme.success : score > 40 ? theme.warning : theme.error;

  const metrics = [
    { label: 'Content relevance', score: 8 },
    { label: 'Delivery & clarity', score: 7 },
    { label: 'Timing', score: 9 },
    { label: 'Confidence signals', score: 6 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', minHeight: 'calc(100vh - 81px)' }} className="fade-up">
      <div style={{ background: theme.surfaceAlt, padding: '48px 40px', borderRight: `1px solid ${theme.rule}` }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Feedback · Question 03 of 08
        </div>
        <span className="mono" style={{
          display: 'inline-block', padding: '4px 10px',
          background: theme.ink, color: theme.bg,
          fontSize: 10, fontWeight: 500, letterSpacing: '0.1em',
          marginBottom: 20,
        }}>BEHAVIOURAL</span>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.3, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
          "Tell me about a time you had to manage multiple competing priorities. How did you handle it?"
        </h2>

        <button onClick={() => setTranscriptOpen(!transcriptOpen)} style={{
          width: '100%', padding: 16,
          background: theme.surface, border: `1px solid ${theme.rule}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your transcript</span>
          {transcriptOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {transcriptOpen && (
          <div className="serif" style={{ padding: 20, background: theme.surface, border: `1px solid ${theme.rule}`, borderTop: 'none', fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>
            "So, <span style={{ background: `${theme.warning}40`, padding: '0 4px', fontStyle: 'normal', fontFamily: mono, fontSize: 13 }}>um</span> during my internship I had three projects running at the same time. <span style={{ background: `${theme.warning}40`, padding: '0 4px', fontStyle: 'normal', fontFamily: mono, fontSize: 13 }}>like</span> the mobile redesign, a stakeholder report, and onboarding documentation. I prioritised based on urgency and impact, and <span style={{ background: `${theme.warning}40`, padding: '0 4px', fontStyle: 'normal', fontFamily: mono, fontSize: 13 }}>um</span> communicated trade-offs to my manager early."
          </div>
        )}
      </div>

      <div style={{ padding: '48px 40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginBottom: 40, borderBottom: `1px solid ${theme.rule}`, paddingBottom: 32 }}>
          <div className="serif" style={{ fontSize: 144, fontWeight: 600, color: scoreColor, lineHeight: 0.9 }}>
            {score}
          </div>
          <div style={{ paddingBottom: 12 }}>
            <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', color: theme.inkSoft, marginBottom: 4 }}>"a good answer."</div>
            <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>A few areas to refine</div>
          </div>
        </div>

        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>
          The Metrics
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 50px',
              alignItems: 'center', gap: 16, padding: '12px 16px',
              background: theme.surface, border: `1px solid ${theme.rule}`,
            }}>
              <span className="serif" style={{ fontSize: 17 }}>{m.label}</span>
              <div style={{ background: theme.surfaceAlt, height: 4, overflow: 'hidden' }}>
                <div style={{ width: `${m.score * 10}%`, height: '100%', background: m.score >= 7 ? theme.success : theme.warning }} />
              </div>
              <span className="serif" style={{ fontWeight: 600, fontSize: 22, textAlign: 'right' }}>{m.score}<span className="mono" style={{ fontSize: 11, color: theme.inkFaint }}>/10</span></span>
            </div>
          ))}
        </div>

        <div style={{ background: `${theme.success}10`, borderLeft: `3px solid ${theme.success}`, padding: 24, marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.success, marginBottom: 12, fontWeight: 600 }}>Strengths</div>
          <ul className="serif" style={{ margin: 0, paddingLeft: 24, lineHeight: 1.7, fontSize: 17 }}>
            <li>You clearly described the situation with relevant context.</li>
            <li>Strong use of specific actions you took.</li>
          </ul>
        </div>

        <div style={{ background: `${theme.warning}10`, borderLeft: `3px solid ${theme.warning}`, padding: 24, marginBottom: 32 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.warning, marginBottom: 12, fontWeight: 600 }}>Refine</div>
          <ul className="serif" style={{ margin: 0, paddingLeft: 24, lineHeight: 1.7, fontSize: 17 }}>
            <li>Quantify the result (e.g. "reduced turnaround by 30%"). Right now it's vague.</li>
            <li>Six filler words detected ("um", "like"). Try pausing instead.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setPage('practice')} className="mono" style={{
            flex: 1, padding: 16, border: `1px solid ${theme.rule}`,
            fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <ChevronLeft size={14} /> Try again
          </button>
          <button onClick={() => setPage('dashboard')} style={{
            flex: 1, padding: 16, background: theme.ink, color: theme.bg,
            fontWeight: 500, fontSize: 13, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            SAVE & NEXT <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
