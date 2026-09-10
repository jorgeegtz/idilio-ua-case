import { useState, useMemo } from 'react';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { waterfallAllocate, scenarioSweep, fmt } from '../lib/powerCurve';
import type { CampaignInput } from '../lib/powerCurve';

const BASE_CHANNELS: CampaignInput[] = activeCampaigns
  .filter(c => c.curveA > 0)
  .map(c => ({ id: c.id, params: { a: c.curveA, b: c.curveB }, minSpendDaily: 10, maxSpendDaily: (c.proposedMonthly / 30) * 2.5 }));

interface ChartProps {
  data: { budget: number; revenue: number; roas: number }[];
  currentBudget: number;
  isDark: boolean;
}

function SvgChart({ data, currentBudget, isDark }: ChartProps) {
  const W = 800, H = 260, PL = 58, PR = 48, PT = 16, PB = 28;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;

  const maxRev  = Math.max(...data.map(d => d.revenue));
  const maxRoas = Math.max(...data.map(d => d.roas));
  const minB    = data[0].budget;
  const maxB    = data[data.length - 1].budget;

  const xP  = (b: number) => PL + ((b - minB) / (maxB - minB)) * innerW;
  const yR  = (v: number) => PT + innerH - (v / maxRev) * innerH;
  const yRo = (v: number) => PT + innerH - (v / maxRoas) * innerH;

  const revPath  = data.map((d, i) => `${i===0?'M':'L'}${xP(d.budget).toFixed(1)},${yR(d.revenue).toFixed(1)}`).join(' ');
  const roasPath = data.map((d, i) => `${i===0?'M':'L'}${xP(d.budget).toFixed(1)},${yRo(d.roas).toFixed(1)}`).join(' ');
  const cx = xP(Math.round(currentBudget / 1000));

  const grid   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const label  = isDark ? '#6e6e88' : '#888899';
  const legend = isDark ? '#b0b0c8' : '#444458';

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    rev:  Math.round(maxRev * t / 1000),
    roas: Math.round(maxRoas * t),
    y:    PT + innerH * (1 - t),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      {yTicks.map(t => (
        <g key={t.y}>
          <line x1={PL} x2={W-PR} y1={t.y} y2={t.y} stroke={grid} strokeWidth={1} />
          <text x={PL-6} y={t.y+4} textAnchor="end" fontSize={9} fill={label}>${t.rev}K</text>
          <text x={W-PR+6} y={t.y+4} textAnchor="start" fontSize={9} fill={label}>{t.roas}%</text>
        </g>
      ))}
      {[60,90,120,150,200].map(t => (
        <text key={t} x={xP(t)} y={H-4} textAnchor="middle" fontSize={9} fill={label}>${t}K</text>
      ))}
      <line x1={cx} x2={cx} y1={PT} y2={PT+innerH} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={cx+4} y={PT+11} fontSize={9} fill="#9d6ffd">actual</text>
      <path d={revPath}  fill="none" stroke="#22c55e" strokeWidth={2.5} />
      <path d={roasPath} fill="none" stroke="#ff4d85" strokeWidth={2} strokeDasharray="6 3" />
      <line x1={PL} x2={PL+18} y1={H-10} y2={H-10} stroke="#22c55e" strokeWidth={2.5} />
      <text x={PL+22} y={H-6} fontSize={9} fill={legend}>Revenue mensual</text>
      <line x1={PL+130} x2={PL+148} y1={H-10} y2={H-10} stroke="#ff4d85" strokeWidth={2} strokeDasharray="6 3" />
      <text x={PL+152} y={H-6} fontSize={9} fill={legend}>ROAS %</text>
    </svg>
  );
}

interface SimProps { theme: 'dark' | 'light'; }

export default function Simulator({ theme }: SimProps) {
  const [budget, setBudget] = useState(TOTAL_BUDGET_MONTHLY);
  const [caps, setCaps] = useState<Record<string, number>>(
    Object.fromEntries(activeCampaigns.filter(c => c.curveA > 0).map(c => [c.id, c.proposedMonthly]))
  );

  const isDark = theme === 'dark';
  const t = {
    bgCard:  isDark ? '#1f1f35' : '#f8f8fc',
    bgRow:   isDark ? '#26263d' : '#ececf8',
    border:  isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    text0:   isDark ? '#f5f5f7' : '#111118',
    text1:   isDark ? '#b0b0c8' : '#444458',
    text2:   isDark ? '#6e6e88' : '#888899',
    green:   '#22c55e',
    amber:   '#f59e0b',
    red:     '#ef4444',
  };

  const channels = useMemo<CampaignInput[]>(() =>
    BASE_CHANNELS.map(c => ({ ...c, maxSpendDaily: (caps[c.id] ?? activeCampaigns.find(a => a.id === c.id)?.proposedMonthly ?? 0) / 30 })), [caps]);
  const result = useMemo(() => waterfallAllocate(budget / 30, channels), [budget, channels]);
  const sweep  = useMemo(() =>
    scenarioSweep(60000, 200000, channels, 30).map(p => ({
      budget:  Math.round(p.budget / 1000),
      revenue: Math.round(p.monthlyRev),
      roas:    parseFloat((p.roas * 100).toFixed(1)),
    })), [channels]);
  const allocMap = Object.fromEntries(result.allocations.map(a => [a.campaignId, a]));

  return (
    <section id="simulator">
      <div className="section-header">
        <span className="section-tag">Live Simulator</span>
        <h2>What-If Budget Planner</h2>
        <p>Ajusta el budget total o los caps por campaña. El modelo waterfall recalcula en tiempo real.</p>
      </div>

      {/* Budget slider */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.text1 }}>Budget mensual total</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: t.text0, fontFamily: 'var(--mono)' }}>{fmt.usd(budget)}</span>
        </div>
        <input type="range" min={60000} max={200000} step={1000} value={budget}
          onChange={e => setBudget(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.text2, marginTop: 4 }}>
          <span>$60K</span><span>$200K</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Rev. estimada / mes', value: fmt.usd(result.totalMonthlyRev), color: t.green },
          { label: 'ROAS blended',        value: fmt.pct(result.blendedRoas),     color: t.text0 },
          { label: 'Rev. estimada / día', value: fmt.usd(result.totalDailyRev),   color: t.green },
        ].map(k => (
          <div key={k.label} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.text2, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* SVG Chart - siempre renderiza */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px 12px 8px', marginBottom: 28 }}>
        <SvgChart data={sweep} currentBudget={budget} isDark={isDark} />
      </div>

      {/* Sliders */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.text2, marginBottom: 10 }}>
        Cap por campaña
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 28 }}>
        {activeCampaigns.filter(c => c.curveA > 0).map(c => {
          const a = allocMap[c.id];
          const capVal = caps[c.id] ?? c.proposedMonthly;
          return (
            <div key={c.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: t.text2 }}>{c.id}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: t.text0 }}>{fmt.usd(capVal)}</span>
              </div>
              <input type="range" min={0} max={50000} step={500} value={capVal}
                onChange={e => setCaps(p => ({ ...p, [c.id]: Number(e.target.value) }))}
                style={{ width: '100%' }} />
              {a && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 4 }}>
                  <span style={{ color: t.text2 }}>Óptimo: {fmt.usd(a.monthlySpend)}</span>
                  <span style={{ color: a.roas >= 0.35 ? t.green : t.amber }}>{fmt.pct(a.roas)} · mROAS {a.mroas.toFixed(2)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabla */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: t.bgRow, borderBottom: `1px solid ${t.border}` }}>
              {['Campaña','Óptimo/mo','ROAS','mROAS'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: h==='Campaña'?'left':'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.text2 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.allocations.sort((a,b) => b.monthlySpend - a.monthlySpend).map(a => (
              <tr key={a.campaignId} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: 10, color: t.text2 }}>{a.campaignId}</td>
                <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 600, color: t.text0 }}>{fmt.usd(a.monthlySpend)}</td>
                <td style={{ padding: '8px 14px', textAlign: 'right', color: a.roas>=0.35?t.green:a.roas>=0.20?t.amber:t.red }}>{fmt.pct(a.roas)}</td>
                <td style={{ padding: '8px 14px', textAlign: 'right', color: t.text2, fontFamily: 'var(--mono)' }}>{a.mroas.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: t.text2, lineHeight: 1.6 }}>
        Modelo: power curve outcome = a x spend^b. Waterfall en incrementos de $10 al canal con mayor mROAS.
        Revenue basis: plataforma D7. iOS = cota superior, no estimado puntual.
      </p>
    </section>
  );
}
