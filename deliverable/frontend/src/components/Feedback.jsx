import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RefreshCw, Loader } from 'lucide-react';
import { API_BASE } from '../constants';

const DEFAULT_QUESTIONS = [
  'Tell me about a time you had to manage multiple competing priorities. How did you handle it?',
];

export default function Feedback({
  theme, mono, setPage,
  roadmapData, setRoadmapData,
  currentQIdx,
  transcript,
  feedbackData, setFeedbackData,
}) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [adapting, setAdapting] = useState(false);
  const [adaptNote, setAdaptNote] = useState('');
  const [adaptError, setAdaptError] = useState('');

  const questions = roadmapData?.questions || DEFAULT_QUESTIONS;
  const currentQuestion = questions[currentQIdx] || questions[0];

  // Fetch feedback on mount if not yet fetched
  useEffect(() => {
    if (feedbackData) return;
    if (!transcript || transcript.trim().length < 5) return;
    setLoading(true);
    setApiError('');
    fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: currentQuestion, transcript, roadmap_id: roadmapData?.roadmap_id || '' }),
    })
      .then(r => { if (!r.ok) throw new Error(`Server ${r.status}`); return r.json(); })
      .then(data => { setFeedbackData(data); setLoading(false); })
      .catch(err => { setApiError(err.message); setLoading(false); });
  }, []);

  // ── Adapt roadmap based on this feedback ────────────────────
  const handleAdaptRoadmap = async () => {
    if (!roadmapData || !feedbackData) return;
    setAdapting(true); setAdaptError(''); setAdaptNote('');

    // Derive weak areas from low metric scores
    const weakAreas = (feedbackData.metrics || [])
      .filter(m => m.score < 6)
      .map(m => m.label);

    const payload = {
      roadmap_data: roadmapData,
      feedback_history: [{
        question: currentQuestion,
        score: feedbackData.score,
        weak_areas: weakAreas,
      }],
      completed_weeks: [],
    };

    try {
      const res = await fetch(`${API_BASE}/api/roadmap/adapt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server ${res.status}`);
      }
      const adapted = await res.json();
      setRoadmapData(prev => ({
        ...prev,
        weeks: adapted.weeks || prev.weeks,
        questions: adapted.questions || prev.questions,
      }));
      setAdaptNote(adapted.adaptation_notes || 'Roadmap updated based on your feedback.');
    } catch (err) {
      setAdaptError(err.message);
    } finally {
      setAdapting(false);
    }
  };

  const score = feedbackData?.score ?? 78;
  const scoreColor = score > 70 ? theme.success : score > 40 ? theme.warning : theme.error;
  const headline = feedbackData?.headline ?? 'a good answer.';
  const metrics = feedbackData?.metrics ?? [
    { label: 'Content relevance', score: 8 },
    { label: 'Delivery & clarity', score: 7 },
    { label: 'Timing', score: 9 },
    { label: 'Confidence signals', score: 6 },
  ];
  const strengths = feedbackData?.strengths ?? ['You clearly described the situation.', 'Strong use of specific actions.'];
  const improvements = feedbackData?.improvements ?? ['Quantify your result.', 'Reduce filler words.'];
  const fillerWords = feedbackData?.filler_words ?? [];
  const fillerCount = feedbackData?.filler_count ?? 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', minHeight: 'calc(100vh - 81px)' }} className="fade-up">
      {/* ── Left panel ── */}
      <div style={{ background: theme.surfaceAlt, padding: '48px 40px', borderRight: `1px solid ${theme.rule}` }}>
        <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          The Feedback · Question {currentQIdx + 1} of {questions.length}
        </div>
        <span className="mono" style={{ display: 'inline-block', padding: '4px 10px', background: theme.ink, color: theme.bg, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', marginBottom: 20 }}>BEHAVIOURAL</span>
        <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.3, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
          "{currentQuestion}"
        </h2>

        <button onClick={() => setTranscriptOpen(!transcriptOpen)} style={{ width: '100%', padding: 16, background: theme.surface, border: `1px solid ${theme.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your transcript</span>
          {transcriptOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {transcriptOpen && (
          <div className="serif" style={{ padding: 20, background: theme.surface, border: `1px solid ${theme.rule}`, borderTop: 'none', fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>
            {transcript ? `"${transcript}"` : <span style={{ color: theme.inkFaint, fontStyle: 'normal', fontSize: 14 }}>No transcript. Go to Practice and record or type your answer.</span>}
          </div>
        )}

        {/* Adapt Roadmap */}
        {feedbackData && roadmapData && (
          <div style={{ marginTop: 32 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 12 }}>Adaptive Learning</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: theme.inkSoft, lineHeight: 1.6 }}>
              Score below 70? Let AI re-tune your remaining roadmap to focus on weak areas.
            </p>
            <button
              onClick={handleAdaptRoadmap}
              disabled={adapting}
              style={{
                width: '100%', padding: '14px 20px',
                background: adaptNote ? theme.success : theme.accent,
                color: theme.bg, fontWeight: 500, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: adapting ? 0.7 : 1,
              }}
            >
              {adapting
                ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Adapting roadmap…</>
                : adaptNote
                ? <><RefreshCw size={14} /> Roadmap updated ✓</>
                : <><RefreshCw size={14} /> Adapt My Roadmap</>}
            </button>
            {adaptNote && (
              <p style={{ margin: '12px 0 0', fontSize: 13, color: theme.success, lineHeight: 1.5 }}>{adaptNote}</p>
            )}
            {adaptError && (
              <p style={{ margin: '12px 0 0', fontSize: 13, color: theme.error }}>{adaptError}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Right panel ── */}
      <div style={{ padding: '48px 40px', overflowY: 'auto' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 20 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${theme.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'pulse 1s linear infinite' }} />
            <p className="mono" style={{ color: theme.inkFaint, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Analysing your answer…</p>
          </div>
        )}

        {apiError && (
          <div style={{ padding: '14px 18px', background: `${theme.error}15`, borderLeft: `3px solid ${theme.error}`, color: theme.error, fontSize: 14, marginBottom: 24 }}>
            {apiError}. Showing demo feedback below.
          </div>
        )}

        {!loading && (
          <>
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginBottom: 40, borderBottom: `1px solid ${theme.rule}`, paddingBottom: 32 }}>
              <div className="serif" style={{ fontSize: 144, fontWeight: 600, color: scoreColor, lineHeight: 0.9 }}>{score}</div>
              <div style={{ paddingBottom: 12 }}>
                <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', color: theme.inkSoft, marginBottom: 4 }}>"{headline}"</div>
                <div className="mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {fillerCount > 0 ? `${fillerCount} filler word${fillerCount !== 1 ? 's' : ''} detected` : 'Clean delivery'}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 16 }}>The Metrics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 50px', alignItems: 'center', gap: 16, padding: '12px 16px', background: theme.surface, border: `1px solid ${theme.rule}` }}>
                  <span className="serif" style={{ fontSize: 17 }}>{m.label}</span>
                  <div style={{ background: theme.surfaceAlt, height: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${m.score * 10}%`, height: '100%', background: m.score >= 7 ? theme.success : theme.warning }} />
                  </div>
                  <span className="serif" style={{ fontWeight: 600, fontSize: 22, textAlign: 'right' }}>
                    {m.score}<span className="mono" style={{ fontSize: 11, color: theme.inkFaint }}>/10</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div style={{ background: `${theme.success}10`, borderLeft: `3px solid ${theme.success}`, padding: 24, marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.success, marginBottom: 12, fontWeight: 600 }}>Strengths</div>
              <ul className="serif" style={{ margin: 0, paddingLeft: 24, lineHeight: 1.7, fontSize: 17 }}>
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            {/* Improvements */}
            <div style={{ background: `${theme.warning}10`, borderLeft: `3px solid ${theme.warning}`, padding: 24, marginBottom: 32 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.warning, marginBottom: 12, fontWeight: 600 }}>Refine</div>
              <ul className="serif" style={{ margin: 0, paddingLeft: 24, lineHeight: 1.7, fontSize: 17 }}>
                {improvements.map((s, i) => <li key={i}>{s}</li>)}
                {fillerWords.length > 0 && (
                  <li>Filler words: {fillerWords.map(w => (
                    <span key={w} className="mono" style={{ background: `${theme.warning}40`, padding: '0 4px', fontSize: 13, marginRight: 4 }}>{w}</span>
                  ))}. Try pausing instead.</li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setPage('practice')} className="mono" style={{ flex: 1, padding: 16, border: `1px solid ${theme.rule}`, fontWeight: 500, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ChevronLeft size={14} /> Try again
              </button>
              <button onClick={() => setPage('dashboard')} style={{ flex: 1, padding: 16, background: theme.ink, color: theme.bg, fontWeight: 500, fontSize: 13, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                NEXT <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
