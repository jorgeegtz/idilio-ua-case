export default function DeliverableC() {
  return (
    <section id="deliverable-c">
      <div className="section-header">
        <span className="section-tag">Deliverable C</span>
        <h2>Plan Operacional</h2>
        <p>Ejecutable desde el lunes. Cinco sistemas, cero ambiguedad.</p>
      </div>
      <div className="ops-grid">
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🏷️</div>
          <h4>1 — Naming Convention</h4>
          <ul>
            <li>Formato: [CANAL]_[GEO]_[OS]_[OBJETIVO]</li>
            <li>Canales: MET · GAC · TT · NET · APL</li>
            <li>Geos: MX · CO · USH · US</li>
            <li>OS: AND · IOS · W2A</li>
            <li>Objetivos: BROAD · TROAS · RTG · AEO · INSTALL</li>
            <li>Nunca renombrar campana live — clonar y pausar</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🎬</div>
          <h4>2 — Creative Testing</h4>
          <ul>
            <li>Max 3 creativos nuevos por campana por semana</li>
            <li>Minimo $500 y 7 dias antes de kill</li>
            <li>Kill: CTR decay mayor 60% en 14 dias</li>
            <li>Kill: D7 ROAS menor 20% a $500+ spend</li>
            <li>Benchmark: CR-15 formato Montaje texto, -29% decay</li>
            <li>Brief correcto: hook conflicto familiar + recap 3s</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>📈</div>
          <h4>3 — Pacing y Scaling</h4>
          <ul>
            <li>Check diario 12PM — flag mayor 15% vs target</li>
            <li>Scale trigger: D7 ROAS mayor 35% AND mROAS mayor 0.5 por 3 dias</li>
            <li>Maximo +20% de budget por semana</li>
            <li>Hold: ROAS entre 20-35%, monitorear 7 dias</li>
            <li>Cut: ROAS menor 20% a $1K+ spend, reducir 50%</li>
            <li>Web2App: evaluar en D30, nunca antes</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🔔</div>
          <h4>4 — Alertas</h4>
          <ul>
            <li>Install gap mayor 25% en cualquier campana</li>
            <li>D7 ROAS cae mayor 15 puntos semana a semana</li>
            <li>CTR decay mayor 40% vs peak 7 dias</li>
            <li>Null CV rate iOS mayor 40%</li>
            <li>Spend diario mayor 20% vs plan a las 6PM</li>
            <li>Todas las alertas a Slack #ua-alerts</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>📊</div>
          <h4>5 — Reporte Semanal al Founder</h4>
          <ul>
            <li>Lunes 9AM, semana anterior</li>
            <li>Una linea: gasto, revenue D7, ROAS, 1 win, 1 riesgo</li>
            <li>Top 3 campanas por D7 ROAS</li>
            <li>1 campana con problema y accion tomada</li>
            <li>Pacing vs plan del mes</li>
            <li>UN solo ask de aprobacion — nunca mas de uno</li>
          </ul>
        </div>
        <div className="ops-card" style={{borderColor:'var(--rose-dim)',background:'rgba(232,23,93,0.04)'}}>
          <div style={{fontSize:20,marginBottom:10}}>⚠️</div>
          <h4>Semana 1 — Acciones tecnicas primero</h4>
          <ul>
            <li>Pausar AdNet-X y TT_USH_IOS_BROAD</li>
            <li>Audit MMP: ventanas de atribucion, S2S postback, FX</li>
            <li>Activar AEM en Meta iOS con purchase como CV primario</li>
            <li>Confirmar LDM en Google iOS</li>
            <li>TikTok iOS: no reactivar hasta confirmar modelado SKAN</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
