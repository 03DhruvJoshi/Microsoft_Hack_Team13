import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, RotateCcw, ChevronRight, ChevronDown, ChevronUp, Upload, Loader } from 'lucide-react';
import { API_BASE } from '../constants';

const DEFAULT_QUESTIONS = [
  'Tell me about a time you had to manage multiple competing priorities. How did you handle it?',
  'Why are you interested in this role?',
  'Describe a project you led from start to finish.',
  'What is your biggest weakness?',
  'Tell me about a time you influenced without authority.',
  'How do you prioritise features when resources are limited?',
  'Describe a time you used data to make a decision.',
  'Where do you see yourself in five years?',
];

// Check browser support once
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = Boolean(SpeechRecognition);

export default function Practice({
  theme, mono, setPage, roadmapData,
  currentQIdx, setCurrentQIdx,
  transcript, setTranscript,
  setFeedbackData,
}) {
  const [recording, setRecording] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [interimText, setInterimText] = useState('');

  const recognitionRef = useRef(null);
  const finalRef = useRef(''); // accumulates confirmed words

  const questions = roadmapData?.questions || DEFAULT_QUESTIONS;
  const totalQ = questions.length;
  const currentQuestion = questions[currentQIdx] || questions[0];

  // Timer
  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  // ── Web Speech API recording ──────────────────────────────────
  const startRecording = () => {
    if (!speechSupported) {
      setUploadError('Speech recognition is not supported in this browser. Use Chrome or Edge, or type your answer below.');
      return;
    }

    setUploadError('');
    finalRef.current = transcript; // preserve any existing text
    setInterimText('');
    setElapsed(0);

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalRef.current += (finalRef.current ? ' ' : '') + t.trim();
        } else {
          interim += t;
        }
      }
      setTranscript(finalRef.current);
      setInterimText(interim);
    };

    rec.onerror = (e) => {
      if (e.error !== 'aborted') setUploadError(`Microphone error: ${e.error}`);
      setRecording(false);
      setInterimText('');
    };

    rec.onend = () => {
      setRecording(false);
      setInterimText('');
    };

    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    setInterimText('');
  };

  const handleReset = () => {
    setElapsed(0);
    setTranscript('');
    setInterimText('');
    setUploadError('');
    finalRef.current = '';
  };

  // ── File upload → backend Whisper ─────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploading(true);
    setUploadError('');
    try {
      const form = new FormData();
      form.append('file', file, file.name);
      const res = await fetch(`${API_BASE}/api/transcribe`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `Server ${res.status}`);
      setTranscript(data.text);
      finalRef.current = data.text;
    } catch (err) {
      setUploadError(`File transcription unavailable: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleGetFeedback = () => {
    setFeedbackData(null);
    setPage('feedback');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', minHeight: 'calc(100vh - 81px)' }} className="fade-up">

      {/* ── Left panel ── */}
      <div style={{ background: theme.surfaceAlt, padding: '48px 40px', borderRight: `1px solid ${theme.rule}` }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Practice · Question {currentQIdx + 1} of {totalQ}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <span className="mono" style={{ display: 'inline-block', padding: '4px 10px', background: theme.ink, color: theme.bg, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em' }}>BEHAVIOURAL</span>
          <button onClick={() => setCurrentQIdx(i => Math.max(0, i - 1))} className="mono" disabled={currentQIdx === 0}
            style={{ padding: '4px 10px', border: `1px solid ${theme.rule}`, fontSize: 10, opacity: currentQIdx === 0 ? 0.3 : 1 }}>◀ PREV</button>
          <button onClick={() => setCurrentQIdx(i => Math.min(totalQ - 1, i + 1))} className="mono" disabled={currentQIdx === totalQ - 1}
            style={{ padding: '4px 10px', border: `1px solid ${theme.rule}`, fontSize: 10, opacity: currentQIdx === totalQ - 1 ? 0.3 : 1 }}>NEXT ▶</button>
        </div>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.2, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
          "{currentQuestion}"
        </h2>

        <button onClick={() => setTipOpen(!tipOpen)} style={{ width: '100%', padding: 16, background: theme.surface, border: `1px solid ${theme.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preparation tip</span>
          {tipOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {tipOpen && (
          <p style={{ padding: '16px 20px', background: theme.surface, border: `1px solid ${theme.rule}`, borderTop: 'none', margin: 0, fontSize: 14 }}>
            Use the STAR method. Aim for 90–120 seconds.
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 24 }}>
          {[{ l: 'S', label: 'Situation' }, { l: 'T', label: 'Task' }, { l: 'A', label: 'Action' }, { l: 'R', label: 'Result' }].map(s => (
            <div key={s.l} style={{ background: theme.surface, border: `1px solid ${theme.rule}`, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="serif" style={{ fontSize: 28, fontWeight: 600, color: theme.accent, lineHeight: 1 }}>{s.l}</span>
              <span style={{ fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Visual feedback box */}
        <div style={{
          width: '100%', maxWidth: 480, aspectRatio: '16/10', background: theme.ink,
          border: recording ? `2px solid ${theme.accent}` : `1px solid ${theme.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
          animation: recording ? 'pulseRing 2s infinite' : 'none', color: theme.bg, position: 'relative',
          padding: 24,
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: theme.accent, color: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
            {roadmapData?.candidate_name?.[0] || 'U'}
          </div>

          {recording && (
            <div className="mono" style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: theme.accent, color: theme.bg, padding: '4px 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
              <span style={{ width: 6, height: 6, background: theme.bg, borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              LIVE
            </div>
          )}

          {/* Real-time interim transcript preview */}
          {(recording && interimText) && (
            <p style={{ margin: 0, fontSize: 13, color: `${theme.bg}99`, fontStyle: 'italic', textAlign: 'center', maxWidth: 360, lineHeight: 1.5 }}>
              "{interimText}"
            </p>
          )}

          {recording && !interimText && (
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {[0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0].map((d, i) => (
                <div key={i} style={{ width: 4, height: 16, background: theme.accent, animation: `wave 0.6s ${d}s infinite ease-in-out` }} />
              ))}
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="serif" style={{ marginTop: 20, fontSize: 64, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: recording ? theme.accent : theme.ink, lineHeight: 1 }}>
          {mm}:{ss}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={uploading}
            style={{ padding: '14px 24px', background: recording ? theme.ink : theme.accent, color: theme.bg, fontWeight: 500, fontSize: 14, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8, opacity: uploading ? 0.5 : 1 }}
          >
            {recording ? <><Pause size={16} /> STOP</> : <><Mic size={16} /> START RECORDING</>}
          </button>

          {(transcript || elapsed > 0) && !recording && (
            <button onClick={handleReset} className="mono" style={{ padding: '14px 18px', border: `1px solid ${theme.rule}`, fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={14} /> Reset
            </button>
          )}

          <label style={{ cursor: uploading ? 'wait' : 'pointer' }}>
            <input type="file" accept="audio/*,video/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
            <span className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', border: `1px solid ${theme.rule}`, fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: uploading ? 0.5 : 1 }}>
              {uploading ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…</> : <><Upload size={14} /> Upload file</>}
            </span>
          </label>
        </div>

        {/* Browser support / error messages */}
        {!speechSupported && !recording && (
          <p className="mono" style={{ fontSize: 11, color: theme.warning, marginTop: 12, letterSpacing: '0.06em', textAlign: 'center' }}>
            Live transcription requires Chrome or Edge. Type your answer below instead.
          </p>
        )}
        {uploadError && (
          <p style={{ fontSize: 13, color: theme.error, marginTop: 10, maxWidth: 480, textAlign: 'center', lineHeight: 1.5 }}>
            {uploadError}
          </p>
        )}

        {/* Transcript textarea — auto-filled by speech, editable */}
        <div style={{ width: '100%', maxWidth: 480, marginTop: 24 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 8 }}>
            Your answer <span style={{ opacity: 0.6 }}>(auto-filled as you speak, or type/paste)</span>
          </div>
          <textarea
            value={transcript + (interimText ? ` ${interimText}` : '')}
            onChange={e => { setTranscript(e.target.value); finalRef.current = e.target.value; }}
            placeholder="Press Start Recording and speak, or type your answer here…"
            style={{ width: '100%', minHeight: 120, padding: 14, border: `1px solid ${recording ? theme.accent : theme.rule}`, background: theme.bg, color: theme.ink, resize: 'vertical', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, transition: 'border-color 0.2s' }}
          />
        </div>

        {transcript.trim().length > 10 && (
          <button onClick={handleGetFeedback} style={{
            marginTop: 16, padding: '16px 32px', background: theme.ink, color: theme.bg,
            fontWeight: 500, fontSize: 14, letterSpacing: '0.05em', width: '100%', maxWidth: 480,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            GET AI FEEDBACK <ChevronRight size={16} />
          </button>
        )}

        <p className="mono" style={{ fontSize: 10, color: theme.inkFaint, marginTop: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Transcribed live in-browser · Never stored without consent
        </p>
      </div>
    </div>
  );
}
