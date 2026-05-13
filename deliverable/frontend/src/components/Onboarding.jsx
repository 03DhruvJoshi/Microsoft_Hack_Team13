import React, { useState } from 'react';
import { FileText, Briefcase, Calendar as CalIcon, ChevronRight, CheckCircle2, Circle, Upload, ArrowLeft } from 'lucide-react';
import { API_BASE } from '../constants';

export default function Onboarding({ theme, mono, setPage, setRoadmapData }) {
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [date, setDate] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCvText(ev.target.result);
    reader.readAsText(file);
  };

  const handleAnalyse = async () => {
    setLoading(true);
    setLoadError('');
    const stepTimers = [1, 2, 3].map((s, i) =>
      setTimeout(() => setLoadStep(s), (i + 1) * 700)
    );
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: cvText || '(CV text unavailable — binary file)',
          job_description: jdText,
          interview_date: date,
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setRoadmapData(data);
      setLoadStep(4);
      setTimeout(() => setPage('roadmap'), 600);
    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setLoadError(`Could not reach the API: ${err.message}. Make sure main.py is running on port 8000 and that your backend/.env file contains AZURE_OPENAI_KEY and OPENAI_API_KEY (required for Whisper transcription).`);
      setLoading(false);
      setLoadStep(0);
    }
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
        <p className="mono" style={{ color: theme.inkFaint, marginTop: 32, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Analysing with AI, hang tight</p>
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
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>01. Your CV</span>
          </div>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            width: '100%', padding: 36, cursor: 'pointer',
            border: `2px dashed ${cvFile ? theme.success : theme.rule}`,
            background: cvFile ? `${theme.success}10` : 'transparent',
          }}>
            <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
            {cvFile ? (
              <>
                <CheckCircle2 size={28} color={theme.success} />
                <span style={{ fontWeight: 600 }}>{cvFile.name}</span>
                <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Click to replace</span>
              </>
            ) : (
              <>
                <Upload size={26} color={theme.inkFaint} />
                <span className="serif" style={{ fontSize: 18, fontStyle: 'italic' }}>Drop your CV here</span>
                <span className="mono" style={{ fontSize: 10, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>PDF · DOCX · TXT · Max 5MB</span>
              </>
            )}
          </label>
        </div>

        <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Briefcase size={18} />
            <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>02. Job Description</span>
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
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            03. Interview date <span style={{ color: theme.inkFaint }}>(optional)</span>
          </span>
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

      {loadError && (
        <div style={{ marginBottom: 16, padding: '14px 18px', background: `${theme.error}15`, borderLeft: `3px solid ${theme.error}`, fontSize: 14, color: theme.error }}>
          {loadError}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleAnalyse} disabled={!cvFile || !jdText} style={{
          padding: '18px 32px',
          background: (cvFile && jdText) ? theme.ink : theme.inkFaint,
          color: theme.bg, fontWeight: 500, fontSize: 15, letterSpacing: '0.02em',
          opacity: (cvFile && jdText) ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: (cvFile && jdText) ? 'pointer' : 'not-allowed',
        }}>
          Analyse & build my plan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
