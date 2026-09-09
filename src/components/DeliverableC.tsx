import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { fmt, scenarioSweep, waterfallAllocate, type CampaignInput } from '../lib/powerCurve';

const BUDGET_MIN = 40000;
const BUDGET_MAX = 280000;
const INTERVALS = 25;

export default function DeliverableC() {
  const channels: CampaignInput[] = useMemo(
    () => activeCampaigns.map((c) => ({ id: c.id, params: { a: c.curveA, b: c.curveB } })),
    [],
  );

  const points = useMemo(
    () => scenarioSweep(BUDGET_MIN, BUDGET_MAX, channels, INTERVALS),
    [channels],
  );

  const chartData = points.map((p) => ({
    budget: p.budget,
    monthlyRev: p.monthlyRev,
    roas: Number((p.roas * 100).toFixed(1)),
  }));

  const atCurrent = useMemo(() => {
    const dailyBudget = TOTAL_BUDGET_MONTHLY / 30;
    const r = waterfallAllocate(dailyBudget, channels);
    return { monthlyRev: r.totalMonthlyRev, roas: r.blendedRoas };
  }, [channels]);

  const atDouble = useMemo(() => {
    const dailyBudget = (TOTAL_BUDGET_MONTHLY * 2) / 30;
    const r = waterfallAllocate(dailyBudget, channels);
    return { monthlyRev: r.totalMonthlyRev, roas: r.blendedRoas };
  }, [channels]);

  const efficiencyLoss = 1 - atDouble.roas / atCurrent.roas;

  return (
    <div>
      <div className="section-head">
        <h2>Deliverable C — Scenario Planning</h2>
        <p>
          Sweeping total monthly budget from {fmt.usd(BUDGET_MIN)} to {fmt.usd(BUDGET_MAX)},
          reallocating optimally at each step, to show where the blended power curve starts
          bending — i.e. how much budget the current 11 live channels can actually absorb before
          ROAS erodes.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Rev @ current budget ({fmt.usd(TOTAL_BUDGET_MONTHLY)})</span>
          <span className="stat-value">{fmt.usd(atCurrent.monthlyRev)}</span>
          <span className="stat-sub">{fmt.x(atCurrent.roas)} blended ROAS</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rev @ 2x budget ({fmt.usd(TOTAL_BUDGET_MONTHLY * 2)})</span>
          <span className="stat-value">{fmt.usd(atDouble.monthlyRev)}</span>
          <span className="stat-sub">{fmt.x(atDouble.roas)} blended ROAS</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Efficiency loss if doubled</span>
          <span className="stat-value" style={{ color: 'var(--hold)' }}>
            −{fmt.pct(Math.max(0, efficiencyLoss))}
          </span>
          <span className="stat-sub">blended ROAS decline</span>
        </div>
      </div>

      <div className="card">
        <span className="card-title">Monthly revenue &amp; blended ROAS vs. total budget</span>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 4, right: 16, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="budget"
                tickFormatter={(v) => fmt.usd(v)}
                stroke="var(--text)"
                fontSize={11}
              />
              <YAxis
                yAxisId="rev"
                tickFormatter={(v) => fmt.usd(v)}
                stroke="var(--text)"
                fontSize={11}
              />
              <YAxis
                yAxisId="roas"
                orientation="right"
                tickFormatter={(v) => `${v}%`}
                stroke="var(--text)"
                fontSize={11}
              />
              <Tooltip
                formatter={(v, name) => (name === 'ROAS' ? `${v}%` : fmt.usd(Number(v)))}
                labelFormatter={(v) => `Budget: ${fmt.usd(Number(v))}`}
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                x={TOTAL_BUDGET_MONTHLY}
                yAxisId="rev"
                stroke="var(--accent)"
                strokeDasharray="4 4"
                label={{ value: 'Current', fill: 'var(--accent)', fontSize: 11, position: 'top' }}
              />
              <Line
                yAxisId="rev"
                type="monotone"
                dataKey="monthlyRev"
                name="Monthly Revenue"
                stroke="#aa3bff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="roas"
                type="monotone"
                dataKey="roas"
                name="ROAS"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="note">
        The curve is calibrated on current spend levels per channel — the fit is most reliable
        near the observed range and gets speculative past ~1.5–2x historical spend, especially
        for the untested US-general TEST line. Use this to size the next budget conversation, not
        as a guaranteed forecast.
      </div>
    </div>
  );
}
