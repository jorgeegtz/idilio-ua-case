export default function DeliverableB() {
  return (
    <section id="deliverable-b">
      <div className="section-header">
        <span className="section-tag">Deliverable B</span>
        <h2>Decision Memo</h2>
        <p></p>
      </div>
      <div className="card" style={{width:"100%"}}>
        <h3>1. Métrica rectora</h3>
        <p><strong>D7 ROAS en base Singular.</strong> Deduplica entre canales y no infla iOS. El spreadsheet reporta 43.5% blended usando revenue de plataforma, el número real es 35.1%. La diferencia son 8 puntos de iOS con SKAN mal configurado. D30/D7 como señal secundaria de maduración. mROAS del modelo de curva de potencia como trigger de escala.</p>
        <h3>2. Cuando MMP y plataforma no cuadran</h3>
        <div className="highlight-box">Singular gobierna installs y revenue. Plataforma gobierna spend, es lo que se factura. Cuando difieren, Singular tiene razón sobre el outcome y plataforma tiene razón sobre el costo.</div>
        <p>En iOS el gap es 40%: plataforma reporta 22,469 installs, Singular confirma 13,581. Causa: 33-36% de CVs nulos en SKAN. En Android el gap es menor al 3%, varianza normal de deduplicación.</p>
        <h3>3. Qué encontramos que cambió la asignación</h3>
        <p><strong>Android MX y CO no está saturado.</strong> MET_MX_AND_BROAD_AEO duplicó presupuesto en semana 6 sin colapso de ROAS. Elasticidad b=0.88-0.92. Escalamos.</p>
        <p><strong>iOS no se puede medir hoy.</strong> 33-36% de CVs nulos impide que las plataformas optimicen hacia revenue. TikTok iOS no tiene modelado probabilístico, atribución ciega. Meta iOS tiene AEM disponible pero sin configurar. Cap a $8K total.</p>
        <p><strong>AdNet-X no tiene fit de audiencia.</strong> Retención D1 de 8% vs. 33% del resto. Conversión a payer de 0.27% vs. 1.8-5.7%. Consistente durante 9 semanas. Pausamos.</p>
        <h3>4. Lo que no podemos concluir</h3>
        <p><strong>Sin incrementalidad:</strong> No sabemos cuánto del ROAS de MET_MX_RTG_PAYERS es real. La audiencia son pagadores existentes que pueden volver orgánicamente. Requiere holdout test.</p>
        <p><strong>Sin Singular diario:</strong> Los coeficientes del modelo usan revenue de plataforma. iOS es upper bound, no point estimate.</p>
        <p><strong>Sin AEM configurado:</strong> Cualquier número de iOS es un estimado degradado. Lo que pedimos: export diario de Singular, Conversion Lift en Meta para RTG Payers, confirmación de modelado probabilístico SKAN en TikTok.</p>
      </div>
    </section>
  );
}
