import { useState } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import { simularCredito } from '../services/publicService.js'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'

const PRODUCTOS_TASA = [
  { label: 'Microempresa (Prospera) — TEA 40%', tea: 40 },
  { label: 'Pequeña Empresa (Construyendo Sueños) — TEA 25%', tea: 25 },
  { label: 'Consumo (Momentum) — TEA 33%', tea: 33 },
  { label: 'Hipotecario (Hogar Seguro) — TEA 11.5%', tea: 11.5 },
]

export default function SimuladorPage() {
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('12')
  const [tea, setTea] = useState(33)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSimular = async (e) => {
    e.preventDefault()
    setError('')
    const m = parseFloat(monto)
    const p = parseInt(plazo)
    if (!m || m <= 0) { setError('Ingresa un monto válido'); return }
    if (!p || p < 1) { setError('Ingresa un plazo válido'); return }
    setLoading(true)
    try {
      const res = await simularCredito({ monto: m, plazo: p, tea })
      setResultado(res)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al simular')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-page">
      <PublicHeader />
      <section className="lp-hero" style={{ padding: '60px 24px' }}>
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-hero-tag"><Calculator size={15} /> Simulador de Crédito</span>
            <h1 style={{ fontSize: 32 }}>Calcula tu cuota en segundos</h1>
            <p>Simula tu crédito antes de solicitarlo. Sin compromiso.</p>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: '-40px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
          <div className="lp-login-widget" style={{ margin: 0 }}>
            <div className="lp-login-widget-head" style={{ padding: '16px 20px' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Datos del crédito</span>
            </div>
            <form className="lp-login-widget-body" onSubmit={handleSimular}>
              <label>Monto a financiar (S/)</label>
              <div className="lp-input-wrap" style={{ marginBottom: 14 }}>
                <input type="number" min="100" step="100" placeholder="5000" value={monto} onChange={e => setMonto(e.target.value)} />
              </div>

              <label>Plazo (meses)</label>
              <div className="lp-input-wrap" style={{ marginBottom: 14 }}>
                <input type="number" min="1" max="120" value={plazo} onChange={e => setPlazo(e.target.value)} />
              </div>

              <label>Tasa (TEA %)</label>
              <div className="lp-input-wrap" style={{ marginBottom: 18 }}>
                <select value={tea} onChange={e => setTea(parseFloat(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', padding: '12px 0', fontSize: 15, outline: 'none' }}>
                  {PRODUCTOS_TASA.map(p => (
                    <option key={p.tea} value={p.tea}>{p.label}</option>
                  ))}
                </select>
              </div>

              {error && <p style={{ color: 'var(--hb-red)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

              <button type="submit" className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Calculando…' : 'Simular cuota'} <Calculator size={18} />
              </button>
            </form>
          </div>

          {resultado && (
            <div className="lp-login-widget" style={{ margin: 0 }}>
              <div className="lp-login-widget-head" style={{ padding: '16px 20px' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Resultado de la simulación</span>
              </div>
              <div className="lp-login-widget-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[
                    ['Cuota mensual', `S/ ${resultado.cuota_referencial.toLocaleString('es-PE', { minFrac: 2 })}`],
                    ['TEA', `${resultado.tea}%`],
                    ['TEM', `${resultado.tem}%`],
                    ['TED', `${resultado.ted}%`],
                    ['TCEA', `${resultado.tcea}%`],
                    ['Total intereses', `S/ ${resultado.total_intereses.toLocaleString('es-PE', { minFrac: 2 })}`],
                    ['Total a pagar', `S/ ${resultado.total_pagar.toLocaleString('es-PE', { minFrac: 2 })}`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ borderBottom: '1px solid var(--hb-border)', paddingBottom: 6 }}>
                      <div style={{ fontSize: 12, color: 'var(--hb-muted)' }}>{l}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--hb-red)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', color: '#374151' }}>Cronograma referencial</p>
                <div style={{ maxHeight: 280, overflowY: 'auto', fontSize: 13 }}>
                  <table className="hb-table" style={{ fontSize: 12 }}>
                    <thead>
                      <tr><th>#</th><th>Cuota</th><th>Capital</th><th>Interés</th><th>Saldo</th></tr>
                    </thead>
                    <tbody>
                      {resultado.cronograma.map(c => (
                        <tr key={c.nrocuota}>
                          <td>{c.nrocuota}</td>
                          <td className="num">{c.cuota.toFixed(2)}</td>
                          <td className="num">{c.capital.toFixed(2)}</td>
                          <td className="num">{c.interes.toFixed(2)}</td>
                          <td className="num">{c.saldo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <PublicFooter />
    </div>
  )
}
