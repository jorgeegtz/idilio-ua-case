export interface CurveParams { a: number; b: number; }
export interface AllocationResult { campaignId: string; dailySpend: number; monthlySpend: number; forecastedDailyRev: number; forecastedMonthlyRev: number; roas: number; mroas: number; }
export interface WaterfallResult { allocations: AllocationResult[]; totalDailyRev: number; totalMonthlyRev: number; blendedRoas: number; }

const DELTA = 10;

export function forecast(p: CurveParams, spend: number): number {
  if (spend <= 0 || p.a <= 0 || p.b <= 0) return 0;
  return p.a * Math.pow(spend, p.b);
}
export function roasAtSpend(p: CurveParams, spend: number): number {
  if (spend <= 0) return 0;
  return forecast(p, spend) / spend;
}
export function mroas(p: CurveParams, spend: number, delta = DELTA): number {
  if (spend <= 0 || p.a <= 0) return 0;
  return (forecast(p, spend + delta) - forecast(p, spend)) / delta;
}
export interface CampaignInput { id: string; params: CurveParams; minSpendDaily?: number; maxSpendDaily?: number; }
export function waterfallAllocate(totalDailyBudget: number, channels: CampaignInput[]): WaterfallResult {
  const spend: Record<string, number> = {};
  for (const c of channels) spend[c.id] = Math.max(DELTA, c.minSpendDaily ?? 0);
  let remaining = totalDailyBudget - Object.values(spend).reduce((a, b) => a + b, 0);
  const steps = Math.floor(remaining / DELTA);
  for (let i = 0; i < steps; i++) {
    let bestId: string | null = null; let bestMr = -Infinity;
    for (const c of channels) {
      const maxS = c.maxSpendDaily ?? Infinity;
      if (spend[c.id] + DELTA > maxS) continue;
      const mr = mroas(c.params, spend[c.id]);
      if (mr > bestMr) { bestMr = mr; bestId = c.id; }
    }
    if (bestId) { spend[bestId] += DELTA; remaining -= DELTA; }
  }
  const allocations: AllocationResult[] = channels.map(c => {
    const dailySpend = spend[c.id];
    const dailyRev = forecast(c.params, dailySpend);
    return { campaignId: c.id, dailySpend, monthlySpend: dailySpend * 30, forecastedDailyRev: dailyRev, forecastedMonthlyRev: dailyRev * 30, roas: dailySpend > 0 ? dailyRev / dailySpend : 0, mroas: mroas(c.params, dailySpend) };
  });
  const totalDailyRev = allocations.reduce((s, a) => s + a.forecastedDailyRev, 0);
  const totalDailySpend = allocations.reduce((s, a) => s + a.dailySpend, 0);
  return { allocations, totalDailyRev, totalMonthlyRev: totalDailyRev * 30, blendedRoas: totalDailySpend > 0 ? totalDailyRev / totalDailySpend : 0 };
}
export interface ScenarioPoint { budget: number; dailyBudget: number; dailyRev: number; monthlyRev: number; roas: number; }
export function scenarioSweep(budgetMin: number, budgetMax: number, channels: CampaignInput[], nIntervals = 20): ScenarioPoint[] {
  return Array.from({ length: nIntervals }, (_, i) => {
    const monthlyBudget = budgetMin + i * (budgetMax - budgetMin) / (nIntervals - 1);
    const dailyBudget = Math.round(monthlyBudget / 30 / DELTA) * DELTA;
    const result = waterfallAllocate(dailyBudget, channels);
    return { budget: monthlyBudget, dailyBudget, dailyRev: result.totalDailyRev, monthlyRev: result.totalMonthlyRev, roas: result.blendedRoas };
  });
}
export const fmt = {
  usd: (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v),
  pct: (v: number) => `${(v * 100).toFixed(1)}%`,
  x: (v: number) => `${v.toFixed(2)}x`,
  num: (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v),
};
