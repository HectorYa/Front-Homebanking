import { useState, useEffect } from 'react'
import { getTarifarios } from '../services/publicService.js'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'
import Loader from '../components/ui/Loader.jsx'

export default function TarifariosPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTarifarios()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="lp-page">
      <PublicHeader />
      <section className="lp-hero" style={{ padding: '60px 24px' }}>
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-hero-tag">Transparencia</span>
            <h1 style={{ fontSize: 30 }}>Tarifarios y Tasas</h1>
            <p>Conoce nuestras tasas vigentes. Toda la información clara y sin letra chica.</p>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 900, margin: '-30px auto 0' }}>
          {loading ? <Loader text="Cargando tarifarios…" /> : !data ? (
            <p style={{ textAlign: 'center', color: 'var(--hb-muted)' }}>No se pudieron cargar los tarifarios.</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ margin: 0, color: 'var(--hb-muted)', fontSize: 14 }}>Vigencia: <strong>{data.vigencia}</strong></p>
              </div>
              {data.productos.map(p => (
                <div key={p.codigo} className="hb-card" style={{ marginBottom: 12 }}>
                  <div className="hb-card-title">{p.nombre} <span style={{ fontWeight: 400, color: 'var(--hb-muted)', fontSize: 13 }}>— {p.subtitulo}</span></div>
                  <p style={{ fontSize: 14, color: 'var(--hb-muted)', margin: '0 0 12px' }}>{p.descripcion}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, fontSize: 13 }}>
                    <div><span style={{ color: 'var(--hb-muted)' }}>TEA mín</span><br /><strong>{p.tea_min}%</strong></div>
                    <div><span style={{ color: 'var(--hb-muted)' }}>TEA ref</span><br /><strong>{p.tea_mid}%</strong></div>
                    <div><span style={{ color: 'var(--hb-muted)' }}>TEA máx</span><br /><strong>{p.tea_max}%</strong></div>
                    <div><span style={{ color: 'var(--hb-muted)' }}>TMIC ref</span><br /><strong>{p.tmic_referencial}%</strong></div>
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: 'var(--hb-muted)', textAlign: 'center', marginTop: 20 }}>{data.notas}</p>
            </>
          )}
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
