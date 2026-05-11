import React, { useState, useEffect } from 'react';
import { buildTheme } from './theme';
import Header from './components/Header';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import CalendarSync from './components/CalendarSync';
import Practice from './components/Practice';
import Feedback from './components/Feedback';

export default function App() {
  const [page, setPage] = useState('landing');
  const [a11yOpen, setA11yOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [textSize, setTextSize] = useState(16);

  // Auth state
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('preppath_user') || 'null'); } catch { return null; }
  });

  // Shared AI-generated state
  const [roadmapData, setRoadmapData] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);

  const theme = buildTheme(highContrast);
  const fontFamily = dyslexiaFont ? "'OpenDyslexic', 'Comic Sans MS', sans-serif" : "'Inter', system-ui, sans-serif";
  const serif = dyslexiaFont ? "'OpenDyslexic', 'Comic Sans MS', sans-serif" : "'Fraunces', Georgia, serif";
  const mono = "'JetBrains Mono', ui-monospace, monospace";
  const transition = reduceMotion ? 'none' : 'all 0.2s ease';

  // Restore token on page load
  useEffect(() => {
    const token = localStorage.getItem('preppath_token');
    if (token && !user) {
      fetch('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) { setUser(u); localStorage.setItem('preppath_user', JSON.stringify(u)); } })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('preppath_token');
    localStorage.removeItem('preppath_user');
    setUser(null);
    setRoadmapData(null);
    setPage('landing');
  };

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg, color: theme.ink,
      fontFamily, fontSize: `${textSize}px`, lineHeight: 1.6, letterSpacing: '0.005em',
      transform: `scale(${zoom / 100})`, transformOrigin: 'top left',
      width: `${10000 / zoom}%`, transition,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.cdnfonts.com/css/opendyslexic');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; font-size: inherit; }
        input, textarea, select { font-family: inherit; font-size: inherit; }
        button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid ${theme.accent}; outline-offset: 2px; }
        .serif { font-family: ${serif}; letter-spacing: -0.02em; }
        .mono { font-family: ${mono}; }
        .grain { position: fixed; inset: 0; pointer-events: none; opacity: ${highContrast ? 0 : 0.04}; z-index: 1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 ${theme.accent}88; } 70% { box-shadow: 0 0 0 16px ${theme.accent}00; } 100% { box-shadow: 0 0 0 0 ${theme.accent}00; } }
        @keyframes wave { 0%, 100% { height: 8px; } 50% { height: 28px; } }
        .fade-up { animation: ${reduceMotion ? 'none' : 'fadeUp 0.5s ease forwards'}; }
        .card-hover { transition: ${transition}; }
        .card-hover:hover { transform: ${reduceMotion ? 'none' : 'translateY(-2px)'}; box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      `}</style>

      <div className="grain" />

      {page !== 'landing' && page !== 'onboarding' && page !== 'login' && (
        <Header
          page={page} setPage={setPage} theme={theme} mono={mono}
          user={user} onLogout={handleLogout}
        />
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
        {page === 'login' && <Login theme={theme} mono={mono} setPage={setPage} setUser={setUser} />}
        {page === 'onboarding' && (
          <Onboarding theme={theme} mono={mono} setPage={setPage} setRoadmapData={setRoadmapData} />
        )}
        {page === 'dashboard' && (
          <Dashboard theme={theme} mono={mono} setPage={setPage} roadmapData={roadmapData} />
        )}
        {page === 'roadmap' && (
          <Roadmap theme={theme} mono={mono} setPage={setPage} roadmapData={roadmapData} />
        )}
        {page === 'calendar' && (
          <CalendarSync theme={theme} mono={mono} setPage={setPage} roadmapData={roadmapData} />
        )}
        {page === 'practice' && (
          <Practice
            theme={theme} mono={mono} setPage={setPage}
            roadmapData={roadmapData}
            currentQIdx={currentQIdx} setCurrentQIdx={setCurrentQIdx}
            transcript={transcript} setTranscript={setTranscript}
            setFeedbackData={setFeedbackData}
          />
        )}
        {page === 'feedback' && (
          <Feedback
            theme={theme} mono={mono} setPage={setPage}
            roadmapData={roadmapData} setRoadmapData={setRoadmapData}
            currentQIdx={currentQIdx}
            transcript={transcript}
            feedbackData={feedbackData} setFeedbackData={setFeedbackData}
          />
        )}
      </main>
    </div>
  );
}
