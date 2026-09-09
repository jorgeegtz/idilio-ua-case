interface Block {
  title: string;
  narrative: string;
  stats: { value: string; desc: string }[];
}

const BLOCKS: Block[] = [
  {
    title: 'El portafolio',
    narrative: 'Android MX y CO genera el 85% del revenue con el 72% del gasto. Singular es nuestra fuente de verdad para medir y tomar decisiones de budget — pero optimizamos dentro de cada plataforma con sus propios datos, porque para Meta, Google y TikTok esa es su realidad.',
    stats: [
      { value: '35.1%', desc: 'D7 ROAS Singular' },
      { value: '43.5%', desc: 'D7 ROAS plataforma (referencia)' },
      { value: '11 de 12', desc: 'campañas activas próximo mes' },
    ],
  },
  {
    title: 'La audiencia que convierte',
    narrative: 'Un solo geo-OS tiene retención, ROAS y señal MMP confiable al mismo tiempo.',
    stats: [
      { value: '41.8%', desc: 'MX Android D7 ROAS' },
      { value: '$0.48', desc: 'CO Android CPI' },
      { value: '33%', desc: 'retención D1 promedio Android' },
    ],
  },
  {
    title: 'La audiencia que no podemos medir con precisión',
    narrative: 'iOS tiene potencial — el D30/D7 lo sugiere — pero sin atribución probabilística activa los datos de plataforma y Singular no cuadran. Capamos hasta resolver AEM por canal.',
    stats: [
      { value: '−40%', desc: 'install gap iOS' },
      { value: '33–36%', desc: 'null CVs SKAN' },
      { value: '$8K cap', desc: 'iOS hasta activar AEM' },
    ],
  },
  {
    title: 'La audiencia sin fit',
    narrative: 'AdNet-X entrega volumen pero no usuarios de Idilio TV. 9 semanas de datos confirman el patrón sin mejora.',
    stats: [
      { value: '8%', desc: 'retención D1 vs 33% portafolio' },
      { value: '0.27%', desc: 'conversión a payer vs 1.8–5.7% resto' },
      { value: 'Pausar', desc: 'decisión' },
    ],
  },
];

export default function ExecutiveSummary() {
  return (
    <section id="executive-summary">
      <div className="section-header">
        <span className="section-tag">Executive Summary</span>
        <h2>Del portafolio a la campaña</h2>
        <p>$400K histórico → $120K próximos 30 días · Singular basis</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 16 }}>
        {BLOCKS.map((block, i) => (
          <div key={i} style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            borderTop: '2px solid var(--rose)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-0)', marginBottom: 8 }}>
              {block.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>
              {block.narrative}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {block.stats.map((s, si) => (
                <div key={si} style={{
                  flex: 1, background: 'var(--bg-3)', borderRadius: 'var(--radius)', padding: '10px 12px',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--rose-light)', fontFamily: 'var(--mono)', letterSpacing: '-0.02em', marginBottom: 3 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-2)', lineHeight: 1.4 }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
