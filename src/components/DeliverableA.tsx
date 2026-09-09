import { Fragment, useMemo, useState } from 'react';
import type { Action } from '../data/campaigns';
import { campaigns } from '../data/campaigns';
import { fmt } from '../lib/powerCurve';

export const ACTION_META: Record<Action, { label: string; color: string; bg: string }> = {
  SCALE: { label: 'Scale', color: 'var(--scale)', bg: 'var(--scale-bg)' },
  RAISE: { label: 'Raise', color: 'var(--raise)', bg: 'var(--raise-bg)' },
  HOLD: { label: 'Hold', color: 'var(--hold)', bg: 'var(--hold-bg)' },
  TEST: { label: 'Test', color: 'var(--test)', bg: 'var(--test-bg)' },
  AUDIT: { label: 'Audit', color: 'var(--audit)', bg: 'var(--audit-bg)' },
  MIGRATE: { label: 'Migrate', color: 'var(--migrate)', bg: 'var(--migrate-bg)' },
  KILL: { label: 'Kill', color: 'var(--kill)', bg: 'var(--kill-bg)' },
};

function ActionBadge({ action }: { action: Action }) {
  const meta = ACTION_META[action];
  return (
    <span className="badge" style={{ color: meta.color, background: meta.bg }}>
      {meta.label}
    </span>
  );
}

const ACTIONS_ORDER: Action[] = ['SCALE', 'RAISE', 'TEST', 'HOLD', 'AUDIT', 'MIGRATE', 'KILL'];

export default function DeliverableA() {
  const [filter, setFilter] = useState<Action | 'ALL'>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...campaigns].sort((a, b) => b.proposedMonthly - a.proposedMonthly),
    [],
  );

  const rows = filter === 'ALL' ? sorted : sorted.filter((c) => c.action === filter);

  const totals = useMemo(() => {
    const totalSpend = campaigns.reduce((s, c) => s + c.totalSpend, 0);
    const totalRevD7 = campaigns.reduce((s, c) => s + c.singularRevD7, 0);
    const totalRevD30 = campaigns.reduce((s, c) => s + c.singularRevD30, 0);
    const scaleCount = campaigns.filter((c) => c.action === 'SCALE').length;
    const killCount = campaigns.filter((c) => c.action === 'KILL').length;
    return {
      totalSpend,
      blendedD7: totalSpend > 0 ? totalRevD7 / totalSpend : 0,
      blendedD30: totalSpend > 0 ? totalRevD30 / totalSpend : 0,
      scaleCount,
      killCount,
    };
  }, []);

  const presentActions = ACTIONS_ORDER.filter((a) => campaigns.some((c) => c.action === a));

  return (
    <div>
      <div className="section-head">
        <h2>Deliverable A — Performance &amp; Recommendations</h2>
        <p>
          All 13 campaign lines audited on Singular-verified spend, D7/D30 ROAS and install
          discrepancy, with a scale/hold/kill recommendation for each.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Spend (period)</span>
          <span className="stat-value">{fmt.usd(totals.totalSpend)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Blended D7 ROAS</span>
          <span className="stat-value">{fmt.pct(totals.blendedD7)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Blended D30 ROAS</span>
          <span className="stat-value">{fmt.pct(totals.blendedD30)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Scale calls</span>
          <span className="stat-value" style={{ color: 'var(--scale)' }}>
            {totals.scaleCount}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kill calls</span>
          <span className="stat-value" style={{ color: 'var(--kill)' }}>
            {totals.killCount}
          </span>
        </div>
      </div>

      <div className="chip-row">
        <button
          type="button"
          className={`chip ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All ({campaigns.length})
        </button>
        {presentActions.map((a) => (
          <button
            key={a}
            type="button"
            className={`chip ${filter === a ? 'active' : ''}`}
            onClick={() => setFilter(a)}
          >
            {ACTION_META[a].label} ({campaigns.filter((c) => c.action === a).length})
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Canal</th>
              <th>Geo</th>
              <th>OS</th>
              <th className="num">Spend</th>
              <th className="num">CPI</th>
              <th className="num">D7 ROAS</th>
              <th className="num">D30 ROAS</th>
              <th className="num">D30/D7</th>
              <th className="num">Install Gap</th>
              <th>Action</th>
              <th className="num">Proposed / mo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <Fragment key={c.id}>
                <tr onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <td className="mono">{c.id}</td>
                  <td>{c.canal}</td>
                  <td>{c.geo}</td>
                  <td>{c.os}</td>
                  <td className="num">{fmt.usd(c.totalSpend)}</td>
                  <td className="num">${c.cpi.toFixed(2)}</td>
                  <td className="num">{fmt.pct(c.d7Roas)}</td>
                  <td className="num">{fmt.pct(c.d30Roas)}</td>
                  <td className="num">{fmt.x(c.d30d7Ratio)}</td>
                  <td className="num">{fmt.pct(c.installGapPct)}</td>
                  <td>
                    <ActionBadge action={c.action} />
                  </td>
                  <td className="num">{fmt.usd(c.proposedMonthly)}</td>
                </tr>
                {expanded === c.id && (
                  <tr className="reason-row">
                    <td colSpan={12}>{c.reason}</td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
