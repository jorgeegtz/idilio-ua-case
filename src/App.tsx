import { useState, useEffect } from 'react';
import DeliverableA from './components/DeliverableA';
import DeliverableB from './components/DeliverableB';
import DeliverableC from './components/DeliverableC';
import Simulator from './components/Simulator';
import ExecutiveSummary from './components/ExecutiveSummary';
import { fmt, waterfallAllocate } from './lib/powerCurve';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from './data/campaigns';

const NAV_LINKS = [
  { href: '#executive-summary', label: 'Summary' },
  { href: '#deliverable-a', label: 'A · Budget' },
  { href: '#deliverable-b', label: 'B · Memo' },
  { href: '#deliverable-c', label: 'C · Ops' },
  { href: '#simulator', label: '⚡ Simulator' },
];

const channels = activeCampaigns
  .filter(c => c.curveA > 0)
  .map(c => ({ id: c.id, params: { a: c.curveA, b: c.curveB }, minSpendDaily: 10, maxSpendDaily: (c.proposedMonthly / 30) * 2.5 }));
const baseResult = waterfallAllocate(TOTAL_BUDGET_MONTHLY / 30, channels);

function handleNav(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [activeSection, setActiveSection] = useState('executive-summary');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <nav className="topnav">
        <div className="brand">
          <span className="dot" />
          <span>Idilio TV · UA Case</span>
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              
                href={l.href}
                className={activeSection === l.href.slice(1) ? 'active' : ''}
                onClick={() => handleNav(l.href)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="content-area">
        <header className="hero">
          <p className="hero-eyebrow">Media Buyer / UA Case — Idilio TV</p>
          <h1><em>$120,000</em> budget.<br />One decision framework.</h1>
          <p className="hero-sub">
            Análisis completo de UA para una app de micro-dramas en español — MX, CO y US-Hispano.
          </p>
          <div className="hero-stats">
            {[
              { label: 'Total Budget', value: fmt.usd(TOTAL_BUDGET_MONTHLY), cls: 'rose' },
              { label: 'Fcast D7 Rev/mo', value: fmt.usd(baseResult.totalMonthlyRev), cls: 'green' },
              { label: 'Blended ROAS', value: fmt.pct(baseResult.blendedRoas), cls: '' },
              { label: 'Campañas activas', value: '11 de 12', cls: '' },
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
          <p style={{ marginTop: 6, fontSize: 11 }}>
            Base Singular (MMP) · Power curve model · Platform spend as billed
          </p>
        </footer>
      </div>
    </div>
  );
}
