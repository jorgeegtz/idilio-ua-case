import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { activeCampaigns, TOTAL_BUDGET_DAILY, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { fmt, forecast, waterfallAllocate, type CampaignInput } from '../lib/powerCurve';

export default function DeliverableB() {
  const channels: CampaignInput[] = useMemo(
    () => activeCampaigns.map((c) => ({ id: c.id, params: { a: c.curveA, b: c.curveB } })),
    [],
  );

  const optimal = useMemo(() => waterfallAllocate(TOTAL_BUDGET_DAILY, channels), [channels]);

  const rows = useMemo(() => {
    return activeCampaigns
      .map((c) => {
        const manualDaily = c.proposedMonthly / 30;
        const manualDailyRev = forecast({ a: c.curveA, b: c.curveB }, manualDaily);
        const opt = optimal.allocations.find((a) => a.campaignId === c.id)!;
        return {
          id: c.id,
          canal: c.canal,
          label: `${c.canal} ${c.geo} ${c.os}`,
          manualMonthly: c.proposedMonthly,
          manualMonthlyRev: manualDailyRev * 30,
          optimalMonthly: opt.monthlySpend,
          optimalMonthlyRev: opt.forecastedMonthlyRev,
        };
      })
      .sort((a, b) => b.manualMonthly - a.manualMonthly);
  }, [optimal]);

  const manualTotalRev = rows.reduce((s, r) => s + r.manualMonthlyRev, 0);
  const manualBlendedRoas = manualTotalRev / TOTAL_BUDGET_MONTHLY;
  const optimalBlendedRoas = optimal.blendedRoas;
  const revDelta = optimal.totalMonthlyRev - manualTotalRev;
  const revDeltaPct = manualTotalRev > 0 ? revDelta / manualTotalRev : 0;

  return (
    <div>
      <div className="section-head">
        <h2>Deliverable B — Waterfall Budget Reallocation</h2>
        <p>
          Same {fmt.usd(TOTAL_BUDGET_MONTHLY)}/mo pool, reallocated in $10/day increments to the
          channel with the highest marginal ROAS at each step, using each campaign's fitted power
          curve <code>rev = a · spendᵇ</code>.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Manual plan — blended ROAS</span>
          <span className="stat-value">{fmt.x(manualBlendedRoas)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Optimal waterfall — blended ROAS</span>
          <span className="stat-value" style={{ color: 'var(--accent)' }}>
            {fmt.x(optimalBlendedRoas)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Manual — forecast monthly rev</span>
          <span className="stat-value">{fmt.usd(manualTotalRev)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Optimal — forecast monthly rev</span>
          <span className="stat-value">{fmt.usd(optimal.totalMonthlyRev)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Revenue upside</span>
          <span className="stat-value" style={{ color: revDelta >= 0 ? 'var(--scale)' : 'var(--kill)' }}>
            {revDelta >= 0 ? '+' : ''}
            {fmt.pct(revDeltaPct)}
          </span>
        </div>
      </div>

      <div className="card">
        <span className="card-title">Monthly spend — manual plan vs. marginal-ROAS optimum</span>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ left: 12, right: 16, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmt.usd(v)} stroke="var(--text)" fontSize={11} />
              <YAxis type="category" dataKey="label" width={150} stroke="var(--text)" fontSize={11} />
              <Tooltip
                formatter={(v) => fmt.usd(Number(v))}
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="manualMonthly" name="Manual" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              <Bar dataKey="optimalMonthly" name="Optimal" fill="#aa3bff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th className="num">Manual / mo</th>
              <th className="num">Optimal / mo</th>
              <th className="num">Reallocation</th>
              <th className="num">Manual fcst rev</th>
              <th className="num">Optimal fcst rev</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const diff = r.optimalMonthly - r.manualMonthly;
              return (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td className="num">{fmt.usd(r.manualMonthly)}</td>
                  <td className="num">{fmt.usd(r.optimalMonthly)}</td>
                  <td className={`num ${diff >= 0 ? 'delta-up' : 'delta-down'}`}>
                    {diff >= 0 ? '+' : ''}
                    {fmt.usd(diff)}
                  </td>
                  <td className="num">{fmt.usd(r.manualMonthlyRev)}</td>
                  <td className="num">{fmt.usd(r.optimalMonthlyRev)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="note">
        The optimal column is a mechanical output of the marginal-ROAS solver, not a
        recommendation on its own — it has no visibility into attribution risk (iOS discrepancy,
        AEO re-engagement audit), creative fatigue, or platform frequency caps, all of which
        temper the manual plan in Deliverable A. Treat the gap as the ceiling of the current
        curve fits, not a mandate to blindly shift budget.
      </div>
    </div>
  );
}
