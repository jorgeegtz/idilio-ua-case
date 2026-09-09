export default function DeliverableB() {
  return (
    <section id="deliverable-b">
      <div className="section-header">
        <span className="section-tag">Deliverable B</span>
        <h2>Decision Memo</h2>
        <p>Cuatro preguntas requeridas. Escrito para un founder que tiene 5 minutos.</p>
      </div>
      <div className="card memo-body">
        <h3>1 — Metrica rectora</h3>
        <p><strong>D7 ROAS en base Singular.</strong> Deduplica entre canales y no infla iOS. El spreadsheet reporta 43.5% blended usando revenue de plataforma — el numero real es 35.1%. La diferencia son 8 puntos de iOS con SKAN mal configurado. D30/D7 como senal secundaria de maduracion. mROAS del modelo de curva de potencia como trigger de escala.</p>
        <h3>2 — Cuando MMP y plataforma se contradicen</h3>
        <div className="highlight-box">Singular gobierna installs y revenue. Plataforma gobierna spend (es lo que se factura). Cuando los dos difieren, Singular tiene razon sobre el outcome; plataforma tiene razon sobre el costo.</div>
        <p>En iOS el gap es 40% — plataforma reporta 22,469 installs, Singular confirma 13,581. Causa: 33-36% de CVs nulos en SKAN. En Android el gap es menor al 3% — varianza normal de deduplicacion.</p>
        <h3>3 — Que encontramos que cambio la asignacion</h3>
        <p><strong>Android MX y CO no esta saturado.</strong> MET_MX_AND_BROAD_AEO duplico presupuesto en semana 6 sin colapso de ROAS. Elasticidad b=0.88-0.92. Escalamos.</p>
        <p><strong>iOS no se puede medir hoy.</strong> 33-36% de CVs nulos impide que las plataformas optimicen hacia revenue. TikTok iOS no tiene modelado probabilistico — atribucion ciega. Meta iOS tiene AEM disponible pero sin configurar. Cap a $8K total.</p>
        <p><strong>AdNet-X no tiene fit de audiencia.</strong> Retencion D1 de 8% vs 33% del resto. Conversion a payer 0.27% vs 1.8-5.7%. Consistente 9 semanas. Pausamos.</p>
        <h3>4 — Lo que no podemos concluir</h3>
        <p><strong>Sin incrementalidad:</strong> No sabemos cuanto del ROAS de MET_MX_RTG_PAYERS es real — la audiencia son pagadores existentes que pueden volver organicamente. Requiere holdout test.</p>
        <p><strong>Sin Singular diario:</strong> Los coeficientes del modelo de curvas usan revenue de plataforma. iOS es upper bound, no point estimate.</p>
        <p><strong>Sin AEM configurado:</strong> Cualquier numero de iOS es estimado degradado. Pedimos: export diario de Singular, Conversion Lift en Meta para RTG Payers, confirmacion de modelado probabilistico SKAN en TikTok.</p>
      </div>
    </section>
  );
}
