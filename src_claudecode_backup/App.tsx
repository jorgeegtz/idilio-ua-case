import { useState } from 'react';
import { ClipboardList, GitBranch, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { TOTAL_BUDGET_MONTHLY } from './data/campaigns';
import { fmt } from './lib/powerCurve';
import DeliverableA from './components/DeliverableA';
import DeliverableB from './components/DeliverableB';
import DeliverableC from './components/DeliverableC';
import Simulator from './components/Simulator';

type Tab = 'a' | 'b' | 'c' | 'sim';

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: 'a', label: 'A · Performance', icon: ClipboardList },
  { id: 'b', label: 'B · Waterfall', icon: GitBranch },
  { id: 'c', label: 'C · Scenarios', icon: TrendingUp },
  { id: 'sim', label: 'Simulator', icon: SlidersHorizontal },
];

function App() {
  const [tab, setTab] = useState<Tab>('a');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <h1>Idilio TV — Media Buyer Case</h1>
          <span>UA performance audit &amp; budget allocation model</span>
        </div>
        <span className="budget-pill">Monthly UA budget: {fmt.usd(TOTAL_BUDGET_MONTHLY)}</span>
      </header>

      <nav className="app-nav">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === 'a' && <DeliverableA />}
        {tab === 'b' && <DeliverableB />}
        {tab === 'c' && <DeliverableC />}
        {tab === 'sim' && <Simulator />}
      </main>

      <footer className="app-footer">
        Built for the Idilio TV Media Buyer technical case · figures are directional forecasts
        from fitted power curves, not guarantees.
      </footer>
    </div>
  );
}

export default App;
