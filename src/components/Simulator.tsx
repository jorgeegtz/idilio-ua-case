import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { activeCampaigns, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { waterfallAllocate, scenarioSweep, fmt } from '../lib/powerCurve';
import type { CampaignInput } from '../lib/powerCurve';

const BASE_CHANNELS: CampaignInput[] = activeCampaigns
  .filter(c => c.curveA > 0)
  .map(c => ({ id: c.id, params: { a: c.curveA, b: c.curveB }, minSpendDaily: 10, maxSpendDaily: (c.proposedMonthly / 30) * 2.5 }));

export default function Simulator() {
  const [budget, setBudget] = useState(TOTAL_BUDGET_MONTHLY);
  const [caps, setCaps] = useState<Record<string,number>>(Object.fromEntries(activeCampaigns.filter(c=>c.curveA>0).map(c=>[c.id,c.proposedMonthly])));

  const channels = useMemo(() => BASE_CHANNELS.map(c => ({ ...c, maxSpendDaily: (caps[c.id] ?? activeCampaigns.find(a=>a.id===c.id)?.proposedMonthly ?? 0) / 30 })), [caps]);
  const result = useMemo(() => waterfallAllocate(budget / 30, channels), [budget, channels]);
  const sweep = useMemo(() => scenarioSweep(60000, 200000, channels, 30).map(p => ({ budget: Math.round(p.budget/1000), revenue: Math.round(p.monthlyRev), roas: parseFloat((p.roas*100).toFixed(1)) })), [channels]);
  const allocMap = Object.fromEntries(result.allocations.map(a => [a.campaignId, a]));

  return (
    <section id="simulator">
      <div className="section-header">
        <span className="section-tag">Live Simulator</span>
        <h2>What-If Budget Planner</h2>
        <p>Ajusta el budget total o los caps por campana. El modelo waterfall recalcula en tiempo real.</p>
      </div>

      <div className="card" style={{marginBottom:24,padding:'20px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontSize:13,fontWeight:600,color:'var(--text-1)'}}>Budget Mensual Total</span>
          <span style={{fontSize:22,fontWeight:700,color:'var(--rose-light)',fontFamily:'var(--mono)'}}>{fmt.usd(budget)}</span>
        </div>
        <input type="range" min={60000} max={200000} step={1000} value={budget} onChange={e=>setBudget(Number(e.target.value))} style={{width:'100%'}}/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-2)',marginTop:4}}>
          <span>$60K</span><span>$200K</span>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
        {[
          {label:'Fcast Rev/mo',value:fmt.usd(result.totalMonthlyRev),cls:'green'},
          {label:'Blended ROAS',value:fmt.pct(result.blendedRoas),cls:''},
          {label:'Rev/day',value:fmt.usd(result.totalDailyRev),cls:'green'},
        ].map(k=>(
          <div className="sim-kpi" key={k.label}>
            <div className="sim-kpi-label">{k.label}</div>
            <div className={`sim-kpi-value ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'minmax(280px,320px) 1fr',gap:24,alignItems:'start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-2)',marginBottom:4}}>Caps por campana</div>
          {activeCampaigns.filter(c=>c.curveA>0).map(c=>{
            const a = allocMap[c.id];
            return (
              <div key={c.id} className="slider-row">
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:6}}>
                  <span style={{fontFamily:'var(--mono)',color:'var(--text-2)'}}>{c.id}</span>
                  <span style={{fontFamily:'var(--mono)',fontWeight:700,color:'var(--rose-light)'}}>{fmt.usd(caps[c.id]??c.proposedMonthly)}</span>
                </div>
                <input type="range" min={0} max={50000} step={500} value={caps[c.id]??c.proposedMonthly} onChange={e=>setCaps(p=>({...p,[c.id]:Number(e.target.value)}))}/>
                {a&&<div style={{display:'flex',justifyContent:'space-between',fontSize:10,marginTop:4}}>
                  <span style={{color:'var(--text-2)'}}>Optimo: {fmt.usd(a.monthlySpend)}</span>
                  <span style={{color:a.roas>=0.35?'var(--green)':'var(--amber)'}}>{fmt.pct(a.roas)} · mROAS {a.mroas.toFixed(2)}</span>
                </div>}
              </div>
            );
          })}
        </div>

        <div>
          <div className="card" style={{padding:'20px 8px 8px'}}>
            <ResponsiveContainer width="100%" height={320} minWidth={300}>
              <LineChart data={sweep} margin={{top:4,right:24,bottom:4,left:8}}>
                <XAxis dataKey="budget" tickFormatter={v=>`$${v}K`} stroke="var(--text-3)" tick={{fontSize:10,fill:'var(--text-2)'}}/>
                <YAxis yAxisId="rev" tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} stroke="var(--text-3)" tick={{fontSize:10,fill:'var(--text-2)'}}/>
                <YAxis yAxisId="roas" orientation="right" tickFormatter={v=>`${v}%`} stroke="var(--text-3)" tick={{fontSize:10,fill:'var(--text-2)'}}/>
                <Tooltip contentStyle={{background:'var(--bg-3)',border:'1px solid var(--border)',borderRadius:8,fontSize:12}} formatter={(val:unknown)=>[`${val}`,'']} labelFormatter={v=>`$${v}K/mo`}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <ReferenceLine yAxisId="rev" x={Math.round(budget/1000)} stroke="var(--rose)" strokeDasharray="4 2"/>
                <Line yAxisId="rev" dataKey="revenue" name="Revenue" stroke="var(--green)" strokeWidth={2} dot={false}/>
                <Line yAxisId="roas" dataKey="roas" name="ROAS %" stroke="var(--rose-light)" strokeWidth={2} dot={false} strokeDasharray="5 2"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="disclaimer" style={{marginTop:12}}>Power curve outcome = a x spend^b · Waterfall $10 increments · Revenue basis: plataforma D7 · iOS = upper bound</p>
        </div>
      </div>
    </section>
  );
}
