export default function DeliverableC() {
  return (
    <section id="deliverable-c">
      <div className="section-header">
        <span className="section-tag">Deliverable C</span>
        <h2>Plan operacional</h2>
        <p>Sin margen de duda.</p>
      </div>
      <div className="ops-grid">
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🏷️</div>
          <h4>1. Naming convention</h4>
          <ul>
            <li>Formato: [CANAL]_[GEO]_[OS]_[OBJETIVO]</li>
            <li>Canales: MET, GAC, TT, NET, APL</li>
            <li>Geos: MX, CO, USH, US</li>
            <li>OS: AND, IOS, W2A</li>
            <li>Objetivos: BROAD, TROAS, RTG, AEO, INSTALL</li>
            <li>Nunca renombrar una campaña live. Clonar y pausar.</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🎬</div>
          <h4>2. Creative testing</h4>
          <ul>
            <li>Máximo 3 creativos nuevos por campaña por semana.</li>
            <li>Mínimo $500 y 7 días antes de kill.</li>
            <li>Kill: CTR decay mayor a 60% en 14 días.</li>
            <li>Kill: D7 ROAS menor a 20% a $500 de spend.</li>
            <li>Benchmark: CR-15, formato Montaje texto, -29% decay.</li>
            <li>Brief correcto: hook de conflicto familiar con recap en 3s.</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>📈</div>
          <h4>3. Pacing y scaling</h4>
          <ul>
            <li>Check diario 12PM. Flag si hay más de 15% vs. target.</li>
            <li>Scale trigger: D7 ROAS mayor a 35% y mROAS mayor a 0.5 por 3 días consecutivos.</li>
            <li>Máximo 20% de aumento de budget por semana.</li>
            <li>Hold: ROAS entre 20-35%, monitorear 7 días antes de mover.</li>
            <li>Cut: ROAS menor a 20% a $1K de spend, reducir 50%.</li>
            <li>Web2App: evaluar en D30, nunca antes.</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>🔔</div>
          <h4>4. Alertas</h4>
          <ul>
            <li>Install gap mayor a 25% en cualquier campaña.</li>
            <li>D7 ROAS cae más de 15 puntos semana a semana.</li>
            <li>CTR decay mayor a 40% vs. peak de 7 días.</li>
            <li>Null CV rate iOS mayor a 40%.</li>
            <li>Spend diario mayor a 20% vs. plan a las 6PM.</li>
            <li>Todas las alertas a Slack #ua-alerts.</li>
          </ul>
        </div>
        <div className="ops-card">
          <div style={{fontSize:20,marginBottom:10}}>📊</div>
          <h4>5. Reporte semanal al founder</h4>
          <ul>
            <li>Lunes 9AM, cubre la semana anterior.</li>
            <li>Una línea: gasto, revenue D7, ROAS, 1 win, 1 riesgo.</li>
            <li>Top 3 campañas por D7 ROAS.</li>
            <li>1 campaña con problema y acción tomada.</li>
            <li>Pacing vs. plan del mes.</li>
            <li>Un solo ask de aprobación, nunca más de uno.</li>
          </ul>
        </div>
        <div className="ops-card" style={{borderColor:'var(--purple-dim)',background:'rgba(124,58,237,0.04)'}}>
          <div style={{fontSize:20,marginBottom:10}}>⚠️</div>
          <h4>Semana 1. Técnico primero</h4>
          <ul>
            <li>Pausar AdNet-X y TT_USH_IOS_BROAD.</li>
            <li>Audit MMP: ventanas de atribución, S2S postback, FX.</li>
            <li>Activar AEM en Meta iOS con purchase como CV primario.</li>
            <li>Confirmar LDM en Google iOS.</li>
            <li>TikTok iOS: no reactivar hasta confirmar modelado SKAN.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
