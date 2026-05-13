import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Landing({ theme, mono, setPage }) {
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
            AI-powered interview prep that adapts to your schedule, your needs, and your goals. Designed with, not for, neurodivergent students.
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
