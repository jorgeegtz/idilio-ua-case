import { useState, useEffect } from 'react';
import DeliverableA from './components/DeliverableA';
import DeliverableB from './components/DeliverableB';
import DeliverableC from './components/DeliverableC';
import Simulator from './components/Simulator';
import ExecutiveSummary from './components/ExecutiveSummary';
import { fmt, waterfallAllocate } from './lib/powerCurve';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from './data/campaigns';

const NAV = [
  { href: '#executive-summary', label: 'Summary' },
  { href: '#deliverable-a', label: 'A · Budget' },
  { href: '#deliverable-b', label: 'B · Memo' },
  { href: '#deliverable-c', label: 'C · Ops' },
  { href: '#simulator', label: 'Simulator' },
];

const ch = activeCampaigns.filter(c => c.curveA > 0).map(c => ({ id: c.id, params: { a: c.curveA, b: c.curveB }, minSpendDaily: 10, maxSpendDaily: (c.proposedMonthly / 30) * 2.5 }));
const base = waterfallAllocate(TOTAL_BUDGET_MONTHLY / 30, ch);

function goTo(href: string) { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }

export default function App() {
  const [active, setActive] = useState('executive-summary');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="app">
      <nav className="topnav">
        <div className="brand"><span className="dot" /><span>Idilio TV · UA Case</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 99, padding: '5px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--text-1)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <ul className="nav-links">
          {NAV.map(l => (
            <li key={l.href}>
              <a href={l.href} className={active === l.href.slice(1) ? 'active' : ''} onClick={e => { e.preventDefault(); goTo(l.href); }}>
                {l.label}
              </a>
            </li>
          ))}
          </ul>
        </div>
      </nav>
      <div className="content-area">
        <header className="hero">
          <p className="hero-eyebrow">Assessment · Media Buyer UA · Idilio TV</p>
          <h1><em>$120,000</em> de budget. Un framework.</h1>
          <p className="hero-sub">Análisis de UA para una app de micro-dramas en español — MX, CO y US-Hispano. Singular basis.</p>
          <div className="hero-stats">
            {[
              { label: 'Budget', value: fmt.usd(TOTAL_BUDGET_MONTHLY), cls: 'rose' },
              { label: 'Fcast Rev/mo', value: fmt.usd(base.totalMonthlyRev), cls: 'green' },
              { label: 'ROAS', value: fmt.pct(base.blendedRoas), cls: '' },
              { label: 'Candidato', value: 'Jorge E. Gutiérrez', cls: '' },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </header>
        <ExecutiveSummary />
        <hr className="divider" />
        <DeliverableA />
        <hr className="divider" />
        <DeliverableB />
        <hr className="divider" />
        <DeliverableC />
        <hr className="divider" />
        <Simulator />
        <footer>
          <p>Jorge E. Gutiérrez · UA Media Buyer Case · Idilio TV</p>
        </footer>
      </div>
    </div>
  );
}
