import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RotateCcw } from 'lucide-react';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { fmt, waterfallAllocate, type CampaignInput } from '../lib/powerCurve';
import { ACTION_META } from './DeliverableA';

const CANAL_COLORS: Record<string, string> = {
  Meta: '#3b82f6',
  Google: '#f59e0b',
  TikTok: '#ec4899',
  AdNet: '#6b7280',
};

const MIN_BUDGET = 20000;
const MAX_BUDGET = 300000;
const STEP = 5000;

export default function Simulator() {
  const [budget, setBudget] = useState(TOTAL_BUDGET_MONTHLY);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setBudget(TOTAL_BUDGET_MONTHLY);
    setExcluded(new Set());
  };

  const channels: CampaignInput[] = useMemo(
    () =>
      activeCampaigns
        .filter((c) => !excluded.has(c.id))
        .map((c) => ({ id: c.id, params: { a: c.curveA, b: c.curveB } })),
    [excluded],
  );

  const result = useMemo(() => waterfallAllocate(budget / 30, channels), [budget, channels]);

  const rows = useMemo(
    () =>
      result.allocations
        .map((a) => {
          const c = activeCampaigns.find((cc) => cc.id === a.campaignId)!;
          return { ...a, canal: c.canal, geo: c.geo, os: c.os, action: c.action };
        })
        .sort((a, b) => b.monthlySpend - a.monthlySpend),
    [result],
  );

  return (
    <div>
      <div className="section-head">
        <h2>Simulator — Live Budget Allocation</h2>
        <p>
          Drag the total monthly budget or drop channels out of the pool and watch the
          marginal-ROAS waterfall re-optimize allocation across the remaining curves in real
          time.
        </p>
      </div>

      <div className="card">
        <div className="control-row">
          <div className="slider-field">
            <span className="slider-label">
              Total monthly budget
              <span className="slider-value">{fmt.usd(budget)}</span>
            </span>
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={STEP}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>
          <button type="button" className="btn" onClick={reset}>
            <RotateCcw size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
            Reset
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Active channels</span>
          <span className="stat-value">{channels.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Forecast monthly revenue</span>
          <span className="stat-value">{fmt.usd(result.totalMonthlyRev)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Blended ROAS</span>
          <span className="stat-value" style={{ color: 'var(--accent)' }}>
            {fmt.x(result.blendedRoas)}
          </span>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <span className="card-title">Optimal monthly spend by channel</span>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ left: 4, right: 12, top: 4, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="campaignId"
                  stroke="var(--text)"
                  fontSize={10}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={70}
                />
                <YAxis tickFormatter={(v) => fmt.usd(v)} stroke="var(--text)" fontSize={11} />
                <Tooltip
                  formatter={(v) => fmt.usd(Number(v))}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', fontSize: 12 }}
                />
                <Bar dataKey="monthlySpend" radius={[4, 4, 0, 0]}>
                  {rows.map((r) => (
                    <Cell key={r.campaignId} fill={CANAL_COLORS[r.canal] ?? '#aa3bff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <span className="card-title">Channel pool</span>
          <div className="channel-list">
            {activeCampaigns.map((c) => (
              <div className="channel-row" key={c.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={!excluded.has(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  <span className="dot" style={{ background: CANAL_COLORS[c.canal] ?? '#aa3bff' }} />
                  <span className="mono">{c.id}</span>
                </label>
                <span
                  className="badge"
                  style={{ color: ACTION_META[c.action].color, background: ACTION_META[c.action].bg }}
                >
                  {ACTION_META[c.action].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th className="num">Daily spend</th>
              <th className="num">Monthly spend</th>
              <th className="num">Forecast monthly rev</th>
              <th className="num">ROAS</th>
              <th className="num">mROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.campaignId}>
                <td className="mono">{r.campaignId}</td>
                <td className="num">{fmt.usd(r.dailySpend)}</td>
                <td className="num">{fmt.usd(r.monthlySpend)}</td>
                <td className="num">{fmt.usd(r.forecastedMonthlyRev)}</td>
                <td className="num">{fmt.x(r.roas)}</td>
                <td className="num">{fmt.x(r.mroas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
