import { useState, useMemo } from 'react';
import { campaigns, TOTAL_BUDGET_MONTHLY } from '../data/campaigns';
import { fmt } from '../lib/powerCurve';
import type { Action } from '../data/campaigns';

type SortKey = 'proposedMonthly' | 'd7Roas' | 'd30Roas' | 'cpi' | 'installGapPct' | 'd30d7Ratio' | 'totalSpend' | 'singularInstalls';
type BreakdownView = 'campaign' | 'geo' | 'canal' | 'os';

const ACTION_COLOR: Record<Action, string> = {
  SCALE: '#22c55e', RAISE: '#60a5fa', HOLD: '#fbbf24',
  AUDIT: '#fb923c', MIGRATE: '#38bdf8', KILL: '#ef4444', TEST: '#c084fc',
};
const ACTION_DESC: Record<Action, string> = {
  SCALE: 'Aumentar presupuesto. ROAS solido, senal limpia, canal no saturado.',
  RAISE: 'Subir gradualmente. D30/D7 indica revenue que llega despues del D7.',
  HOLD: 'Mantener. Senal parcial o saturacion cercana. Monitorear antes de mover.',
  AUDIT: 'ROAS alto pero incrementalidad dudosa. No escalar sin holdout test.',
  MIGRATE: 'Canal valido pero objetivo de puja incorrecto. Cambiar antes de escalar.',
  KILL: 'Pausar. Tráfico de baja calidad o atribucion completamente ciega.',
  TEST: 'Nueva linea sin historico. Budget fijo 14 dias, no escalar.',
};

export default function DeliverableA() {
  const [sortKey, setSortKey] = useState<SortKey>('proposedMonthly');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [filter, setFilter] = useState<Action|'ALL'>('ALL');
  const [breakdown, setBreakdown] = useState<BreakdownView>('campaign');
  const [showGlossary, setShowGlossary] = useState(false);

  function handleSort(k: SortKey) {
    if (k === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  }

  const filtered = useMemo(() =>
    campaigns.filter(c => filter === 'ALL' || c.action === filter)
      .sort((a, b) => (a[sortKey] - b[sortKey]) * (sortDir === 'asc' ? 1 : -1)),
    [filter, sortKey, sortDir]
  );

  const geoMap = useMemo(() => {
    const m: Record<string,{spend:number,budget:number,d7rev:number,installs:number}> = {};
    campaigns.forEach(c => {
      if (!m[c.geo]) m[c.geo] = {spend:0,budget:0,d7rev:0,installs:0};
      m[c.geo].spend += c.totalSpend; m[c.geo].budget += c.proposedMonthly;
      m[c.geo].d7rev += c.singularRevD7; m[c.geo].installs += c.singularInstalls;
    });
    return Object.entries(m).sort((a,b) => b[1].budget - a[1].budget);
  }, []);

  const canalMap = useMemo(() => {
    const m: Record<string,{spend:number,budget:number,d7rev:number}> = {};
    campaigns.forEach(c => {
      if (!m[c.canal]) m[c.canal] = {spend:0,budget:0,d7rev:0};
      m[c.canal].spend += c.totalSpend; m[c.canal].budget += c.proposedMonthly; m[c.canal].d7rev += c.singularRevD7;
    });
    return Object.entries(m).sort((a,b) => b[1].budget - a[1].budget);
  }, []);

  const osMap = useMemo(() => {
    const m: Record<string,{spend:number,budget:number,d7rev:number,installs:number}> = {};
    campaigns.forEach(c => {
      if (!m[c.os]) m[c.os] = {spend:0,budget:0,d7rev:0,installs:0};
      m[c.os].spend += c.totalSpend; m[c.os].budget += c.proposedMonthly;
      m[c.os].d7rev += c.singularRevD7; m[c.os].installs += c.singularInstalls;
    });
    return Object.entries(m).sort((a,b) => b[1].budget - a[1].budget);
  }, []);

  const total = campaigns.reduce((s,c) => s + c.proposedMonthly, 0);
  const SortIcon = ({k}: {k:SortKey}) => <span style={{marginLeft:4,color:sortKey===k?'var(--rose)':'var(--text-3)'}}>{sortKey===k?(sortDir==='desc'?'↓':'↑'):'↕'}</span>;
  const Th = ({k,children}:{k:SortKey,children:React.ReactNode}) => <th onClick={()=>handleSort(k)} style={{cursor:'pointer'}}>{children}<SortIcon k={k}/></th>;
  const actions: (Action|'ALL')[] = ['ALL','SCALE','RAISE','TEST','AUDIT','MIGRATE','HOLD','KILL'];
  const views: {key:BreakdownView,label:string}[] = [{key:'campaign',label:'Campana'},{key:'geo',label:'Geo'},{key:'canal',label:'Canal'},{key:'os',label:'OS'}];

  return (
    <section id="deliverable-a">
      <div className="section-header">
        <span className="section-tag">Deliverable A</span>
        <h2>Budget Allocation — 30 dias</h2>
        <p>Total: <strong style={{color:'var(--text-0)'}}>{fmt.usd(TOTAL_BUDGET_MONTHLY)}</strong> · Revenue: Singular · Spend: plataforma as billed</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:24}}>
        {[
          {label:'Total Budget',value:fmt.usd(total),cls:'rose'},
          {label:'Campanas activas',value:`${campaigns.filter(c=>c.proposedMonthly>0).length} / ${campaigns.length}`,cls:''},
          {label:'Android %',value:fmt.pct(campaigns.filter(c=>c.os==='Android').reduce((s,c)=>s+c.proposedMonthly,0)/total),cls:'green'},
          {label:'MX + CO %',value:fmt.pct(campaigns.filter(c=>c.geo==='MX'||c.geo==='CO').reduce((s,c)=>s+c.proposedMonthly,0)/total),cls:'green'},
          {label:'iOS cap',value:fmt.usd(campaigns.filter(c=>c.os==='iOS').reduce((s,c)=>s+c.proposedMonthly,0)),cls:''},
        ].map(k=>(
          <div className="stat-card" key={k.label}>
            <div className="stat-label">{k.label}</div>
            <div className={`stat-value ${k.cls}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap',justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:6}}>
          {views.map(v=>(
            <button key={v.key} onClick={()=>setBreakdown(v.key)} style={{fontSize:12,fontWeight:600,padding:'6px 14px',borderRadius:'var(--radius-sm)',border:'1px solid',cursor:'pointer',background:breakdown===v.key?'var(--rose)':'var(--bg-3)',color:breakdown===v.key?'#fff':'var(--text-2)',borderColor:breakdown===v.key?'var(--rose)':'var(--border)'}}>
              {v.label}
            </button>
          ))}
        </div>
        <button onClick={()=>setShowGlossary(g=>!g)} style={{fontSize:11,fontWeight:600,padding:'6px 14px',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)',cursor:'pointer',background:'var(--bg-3)',color:showGlossary?'var(--rose-light)':'var(--text-2)'}}>
          {showGlossary ? 'Cerrar glosario' : '? Glosario'}
        </button>
      </div>

      {showGlossary && (
        <div className="card" style={{marginBottom:24}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text-0)',marginBottom:12}}>Acciones</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:10}}>
            {Object.entries(ACTION_DESC).map(([k,v])=>(
              <div key={k} style={{background:'var(--bg-3)',borderRadius:'var(--radius)',padding:'10px 14px',borderLeft:`3px solid ${ACTION_COLOR[k as Action]}`}}>
                <div style={{fontSize:11,fontWeight:700,color:ACTION_COLOR[k as Action],marginBottom:4}}>{k}</div>
                <div style={{fontSize:12,color:'var(--text-2)',lineHeight:1.5}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {breakdown !== 'campaign' && (
        <div style={{marginBottom:24}}>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{breakdown==='geo'?'GEO':breakdown==='canal'?'Canal':'OS'}</th>
                <th>Spend Hist.</th><th>Budget/mo</th><th>% Total</th><th>D7 Rev</th><th>D7 ROAS</th>
                {breakdown!=='canal'&&<th>Installs MMP</th>}
              </tr></thead>
              <tbody>
                {(breakdown==='geo'?geoMap:breakdown==='canal'?canalMap:osMap).map(([key,v])=>(
                  <tr key={key}>
                    <td className="bold">{key}</td>
                    <td className="mono">{fmt.usd(v.spend)}</td>
                    <td className="bold" style={{color:'var(--rose-light)'}}>{fmt.usd(v.budget)}</td>
                    <td className="mono">{fmt.pct(v.budget/total)}</td>
                    <td className="mono" style={{color:'var(--green)'}}>{fmt.usd(v.d7rev)}</td>
                    <td className="mono" style={{color:v.d7rev/v.spend>=0.35?'var(--green)':v.d7rev/v.spend>=0.20?'var(--amber)':'var(--red)'}}>{fmt.pct(v.d7rev/v.spend)}</td>
                    {breakdown!=='canal'&&<td className="mono">{fmt.num((v as unknown as {installs:number}).installs)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {breakdown === 'campaign' && (
        <>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
            {actions.map(a=>(
              <button key={a} onClick={()=>setFilter(a)} style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'4px 10px',borderRadius:99,border:'1px solid',cursor:'pointer',background:filter===a?'var(--rose)':'var(--bg-3)',color:filter===a?'#fff':'var(--text-2)',borderColor:filter===a?'var(--rose)':'var(--border)'}}>
                {a}
              </button>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Campaign</th><th>Canal</th><th>Geo</th><th>OS</th>
                <Th k="totalSpend">Spend</Th>
                <Th k="singularInstalls">Installs</Th>
                <Th k="cpi">CPI</Th>
                <Th k="d7Roas">D7 ROAS</Th>
                <Th k="d30Roas">D30 ROAS</Th>
                <Th k="d30d7Ratio">D30/D7</Th>
                <Th k="installGapPct">Gap</Th>
                <th>Action</th>
                <Th k="proposedMonthly">Budget/mo</Th>
                <th>Razon</th>
              </tr></thead>
              <tbody>
                {filtered.map(c=>{
                  const col = ACTION_COLOR[c.action];
                  return (
                    <tr key={c.id} style={{opacity:c.action==='KILL'?0.45:1}}>
                      <td style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--text-2)'}}>{c.id}</td>
                      <td>{c.canal}</td><td>{c.geo}</td><td>{c.os}</td>
                      <td className="mono">{fmt.usd(c.totalSpend)}</td>
                      <td className="mono">{fmt.num(c.singularInstalls)}</td>
                      <td className="mono">{c.cpi>0?fmt.usd(c.cpi):'—'}</td>
                      <td className="mono" style={{color:c.d7Roas>=0.35?'var(--green)':c.d7Roas>=0.20?'var(--amber)':c.d7Roas>0?'var(--red)':'var(--text-3)'}}>{c.d7Roas>0?fmt.pct(c.d7Roas):'—'}</td>
                      <td className="mono" style={{color:c.d30Roas>=0.40?'var(--green)':c.d30Roas>=0.25?'var(--amber)':c.d30Roas>0?'var(--red)':'var(--text-3)'}}>{c.d30Roas>0?fmt.pct(c.d30Roas):'—'}</td>
                      <td className="mono" style={{color:c.d30d7Ratio>=1.2?'var(--blue)':'var(--text-2)'}}>{c.d30d7Ratio>0?`${c.d30d7Ratio.toFixed(2)}x`:'—'}</td>
                      <td className="mono" style={{color:c.installGapPct>0.30?'var(--red)':c.installGapPct>0.10?'var(--amber)':'var(--text-2)'}}>{c.installGapPct>0?`-${fmt.pct(c.installGapPct)}`:c.action==='KILL'?'—':'~0%'}</td>
                      <td><span style={{display:'inline-block',fontSize:9,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',padding:'3px 7px',borderRadius:99,background:`${col}18`,color:col,border:`1px solid ${col}40`}}>{c.action}</span></td>
                      <td className="bold" style={{color:c.proposedMonthly>0?'var(--text-0)':'var(--red)'}}>{c.proposedMonthly>0?fmt.usd(c.proposedMonthly):'$0'}</td>
                      <td style={{color:'var(--text-2)',fontSize:11,whiteSpace:'normal',lineHeight:1.5,minWidth:240}}>{c.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:6}}>
            {campaigns.filter(c=>c.proposedMonthly>0).sort((a,b)=>b.proposedMonthly-a.proposedMonthly).map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:190,fontSize:10,fontFamily:'var(--mono)',color:'var(--text-2)',textAlign:'right',flexShrink:0}}>{c.id}</div>
                <div style={{flex:1,height:20,background:'var(--bg-3)',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(c.proposedMonthly/TOTAL_BUDGET_MONTHLY)*100}%`,background:ACTION_COLOR[c.action],borderRadius:4,display:'flex',alignItems:'center',paddingLeft:8,opacity:0.85}}>
                    <span style={{fontSize:10,fontWeight:700,color:'#000',opacity:0.8}}>{fmt.usd(c.proposedMonthly)}</span>
                  </div>
                </div>
                <span style={{fontSize:10,color:ACTION_COLOR[c.action],flexShrink:0,width:50,textAlign:'right'}}>{c.action}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
