import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle, XCircle, AlertTriangle, Loader2, UserCheck, Shield, Building, DollarSign, CreditCard, ChevronRight } from 'lucide-react'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'

// ─── Mock de clientes registrados ──────────────────────────────
const CLIENTES_MOCK = {
  '12345678': { nombre: 'Carlos', apellido: 'García López', ingresos: 3200 },
  '23456789': { nombre: 'María', apellido: 'Quispe Huamán', ingresos: 4800 },
  '34567890': { nombre: 'José', apellido: 'Mendoza Rivas', ingresos: 2500 },
  '45678901': { nombre: 'Ana', apellido: 'Paredes Soto', ingresos: 6100 },
  '56789012': { nombre: 'Pedro', apellido: 'Sánchez Ramos', ingresos: 1800 },
  '67890123': { nombre: 'Lucía', apellido: 'Torres Vilca', ingresos: 4200 },
}

// ─── Mock de deudas SBS ────────────────────────────────────────
const DEUDAS_SBS_MOCK = {
  '34567890': { total: 15000, entidades: 2, calificacion: 'Normal' },
  '56789012': { total: 45000, entidades: 4, calificacion: 'Deficiente' },
}

// ─── Mock de centrales de riesgo ───────────────────────────────
const CENTRALES_MOCK = {
  '56789012': { protestos: true, sentencias: false, alerta: 'Registro de protestos vigente' },
  '12345678': { protestos: false, sentencias: false, alerta: null },
}

// ─── Pasos del chequeo ─────────────────────────────────────────
const PASOS = [
  { id: 'dni', icon: UserCheck, label: 'Validando DNI…', labelOk: 'DNI válido y registrado', labelErr: 'DNI no encontrado en nuestros registros' },
  { id: 'sbs', icon: Shield, label: 'Consultando SBS…', labelOk: 'Sin deudas vencidas en SBS', labelErr: 'Reporta deudas vencidas en SBS' },
  { id: 'centrales', icon: Building, label: 'Verificando centrales de riesgo…', labelOk: 'Sin protestos ni sentencias', labelErr: 'Registro en centrales de riesgo' },
  { id: 'ingresos', icon: DollarSign, label: 'Analizando capacidad de pago…', labelOk: 'Capacidad de pago suficiente', labelErr: 'Ingresos insuficientes para el monto mínimo' },
]

export default function PreCalificadorPage() {
  const navigate = useNavigate()
  const [dni, setDni] = useState('')
  const [resultado, setResultado] = useState(null)
  const [checks, setChecks] = useState([])
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const ejecutarChequeos = useCallback(async (dniIngresado) => {
    setError('')
    setChecks([])
    setResultado(null)
    setChecking(true)

    const results = []
    let apto = true

    // Paso 1: DNI
    await delay(600)
    const cliente = CLIENTES_MOCK[dniIngresado]
    const paso1 = {
      id: 'dni', ok: !!cliente,
      detalle: cliente
        ? `${cliente.nombre} ${cliente.apellido}`
        : 'DNI no registrado en el sistema financiero',
    }
    if (!paso1.ok) apto = false
    results.push(paso1)
    setChecks([...results])

    if (!paso1.ok) {
      setChecking(false)
      setResultado({ apto: false, checks: results })
      return
    }

    // Paso 2: SBS
    await delay(700)
    const deudaSBS = DEUDAS_SBS_MOCK[dniIngresado]
    const paso2 = {
      id: 'sbs', ok: !deudaSBS,
      detalle: deudaSBS
        ? `Deuda total S/ ${deudaSBS.total.toLocaleString('es-PE')} · ${deudaSBS.calificacion}`
        : 'Sin deudas reportadas',
    }
    if (!paso2.ok) apto = false
    results.push(paso2)
    setChecks([...results])

    // Paso 3: Centrales de Riesgo
    await delay(500)
    const central = CENTRALES_MOCK[dniIngresado]
    const paso3 = {
      id: 'centrales', ok: !central || (!central.protestos && !central.sentencias),
      detalle: central?.alerta || 'Sin antecedentes negativos',
    }
    if (!paso3.ok) apto = false
    results.push(paso3)
    setChecks([...results])

    // Paso 4: Ingresos
    await delay(600)
    const ingresoMinimo = 2500
    const paso4 = {
      id: 'ingresos', ok: (cliente?.ingresos || 0) >= ingresoMinimo,
      detalle: cliente
        ? `Ingreso mensual S/ ${cliente.ingresos.toLocaleString('es-PE')} (mín. S/ ${ingresoMinimo.toLocaleString('es-PE')})`
        : 'Ingresos no disponibles',
    }
    if (!paso4.ok) apto = false
    results.push(paso4)
    setChecks([...results])

    setChecking(false)
    setResultado({ apto, cliente, checks: results })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const d = dni.trim()
    if (!/^\d{8}$/.test(d)) { setError('Ingresa un DNI válido de 8 dígitos'); return }
    ejecutarChequeos(d)
  }

  return (
    <div className="lp-page">
      <PublicHeader />

      {/* Hero */}
      <section className="lp-hero" style={{ padding: '50px 24px 40px' }}>
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-hero-tag"><Search size={15} /> Pre-Calificador de Crédito</span>
            <h1 style={{ fontSize: 30 }}>¿Eres apto para un crédito?</h1>
            <p>Ingresa tu DNI y descubre en segundos si cumples con los requisitos. Sin compromiso.</p>
          </div>
        </div>
      </section>

      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 780, margin: '-30px auto 0' }}>
          {/* Formulario DNI */}
          <div className="lp-login-widget" style={{ margin: '0 auto 24px', maxWidth: 460 }}>
            <div className="lp-login-widget-head" style={{ padding: '16px 20px', justifyContent: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Consulta tu elegibilidad</span>
            </div>
            <form className="lp-login-widget-body" onSubmit={handleSubmit}>
              <label htmlFor="dni">Número de DNI</label>
              <div className="lp-input-wrap" style={{ marginBottom: 14 }}>
                <input id="dni" type="text" inputMode="numeric" maxLength="8" placeholder="12345678"
                  value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} />
              </div>
              {error && <p style={{ color: 'var(--hb-red)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
              <button type="submit" className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={checking}>
                {checking ? 'Consultando…' : 'Consultar'} <Search size={18} />
              </button>
            </form>
          </div>

          {/* Checks en vivo */}
          {checks.length > 0 && (
            <div className="hb-card" style={{ marginBottom: 20 }}>
              <div className="hb-card-title"><Search size={18} /> Resultados de la evaluación</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PASOS.map((paso) => {
                  const c = checks.find(ch => ch.id === paso.id)
                  const pendiente = !c && checking
                  return (
                    <div key={paso.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--hb-border)' }}>
                      <span style={{ marginTop: 2 }}>
                        {pendiente ? (
                          <Loader2 size={20} className="hb-spin" style={{ color: 'var(--hb-muted)' }} />
                        ) : !c ? (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--hb-border)' }} />
                        ) : c.ok ? (
                          <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                        ) : (
                          <XCircle size={20} style={{ color: 'var(--error)' }} />
                        )}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: pendiente ? 'var(--hb-muted)' : 'var(--hb-text)' }}>
                          {pendiente ? paso.label : (c?.ok ? paso.labelOk : paso.labelErr)}
                        </div>
                        {c?.detalle && (
                          <div style={{ fontSize: 13, color: 'var(--hb-muted)', marginTop: 2 }}>{c.detalle}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Resultado final */}
          {resultado && !checking && (
            <>
              <div className={`hb-card ${resultado.apto ? '' : ''}`} style={{
                border: `2px solid ${resultado.apto ? 'var(--success)' : 'var(--error)'}`,
                background: resultado.apto ? 'var(--success-light)' : 'var(--error-light)',
              }}>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  {resultado.apto ? (
                    <>
                      <CheckCircle size={48} style={{ color: 'var(--success)' }} />
                      <h2 style={{ margin: '12px 0 4px', fontSize: 24, color: 'var(--success)' }}>¡APTO!</h2>
                      <p style={{ color: 'var(--hb-text)', margin: 0, fontSize: 15 }}>
                        {resultado.cliente
                          ? `${resultado.cliente.nombre}, cumples con los requisitos para solicitar un crédito.`
                          : 'Cumples con los requisitos mínimos.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle size={48} style={{ color: 'var(--error)' }} />
                      <h2 style={{ margin: '12px 0 4px', fontSize: 24, color: 'var(--error)' }}>NO APTO</h2>
                      <p style={{ color: 'var(--hb-text)', margin: 0, fontSize: 15 }}>
                        No cumples con todos los requisitos en este momento. Revisa los detalles arriba.
                      </p>
                    </>
                  )}
                </div>

                {resultado.apto && (
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <p style={{ fontSize: 13, color: 'var(--hb-muted)', marginBottom: 12 }}>
                      Este es un resultado referencial. La evaluación final depende de más variables.
                    </p>
                    <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')} style={{ display: 'inline-flex' }}>
                      Solicitar crédito ahora <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {!resultado.apto && (
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <button className="lp-btn lp-btn-outline" onClick={() => { setDni(''); setChecks([]); setResultado(null); }}
                      style={{ color: 'var(--hb-text)', borderColor: 'var(--border-strong)', display: 'inline-flex' }}>
                      Intentar con otro DNI <Search size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Info adicional */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
            {[
              { icon: Shield, titulo: 'Datos seguros', desc: 'Tu información está protegida y no se almacena.' },
              { icon: CreditCard, titulo: 'Sin compromiso', desc: 'Esta consulta no afecta tu historial crediticio.' },
              { icon: AlertTriangle, titulo: 'Resultado referencial', desc: 'La aprobación final depende de la evaluación completa.' },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="lp-benefit" style={{ padding: 10 }}>
                <span className="lp-benefit-icon"><Icon size={20} /></span>
                <h3 style={{ fontSize: 14 }}>{titulo}</h3>
                <p style={{ fontSize: 12 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />

      <style>{`
        @keyframes hbSpin { to { transform: rotate(360deg); } }
        .hb-spin { animation: hbSpin 1s linear infinite; }
      `}</style>
    </div>
  )
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
