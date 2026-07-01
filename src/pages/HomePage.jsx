import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet, CreditCard, Send, Receipt, FileText, FilePlus2,
  PiggyBank, ChevronRight, TrendingDown, TrendingUp,
  ArrowUpRight, ArrowDownRight, MessageCircle, HelpCircle,
} from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { useCreditos } from '../hooks/useCreditos.js'
import { simboloMoneda, toNumber } from '../utils/format.js'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'

export default function HomePage() {
  const { user } = useHBAuth()
  const navigate = useNavigate()
  const { cuentas, loading: lc } = useCuentas('ahorro')
  const { creditos, loading: lk } = useCreditos()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const totalAhorro = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)
  const totalDeuda = creditos.reduce((s, c) => s + toNumber(c.pago_pendiente), 0)

  const acciones = [
    { icon: Send, label: 'Transferencias propias', to: '/operaciones/transferencia', color: '#e2132b' },
    { icon: Receipt, label: 'Pago de crédito', to: '/operaciones/pago-credito', color: '#f7941e' },
    { icon: FileText, label: 'Pago de servicios', to: '/operaciones/pago-servicios', color: '#00a9a5' },
    { icon: FilePlus2, label: 'Solicitar préstamo', to: '/creditos/solicitar', color: '#8e24aa' },
    { icon: HelpCircle, label: 'Mis Reclamos', to: '/reclamos', color: '#00a9a5' },
  ]

  return (
    <div className={`be-dashboard ${mounted ? 'be-dashboard--visible' : ''}`}>
      <div className="be-dashboard-main">
        {/* Saludo */}
        <div className="be-greeting">
          <h1>Hola {primerNombre(user?.nombre)}, hoy te ofrecemos:</h1>
          <p>Esta es la posición global de tus productos en Financiera Surgir.</p>
        </div>

        {/* KPI Cards */}
        <div className="be-kpi-row">
          <div className="be-kpi-card be-kpi-card--ahorro">
            <div className="be-kpi-header">
              <span className="be-kpi-icon be-kpi-icon--ahorro">
                <PiggyBank size={20} />
              </span>
              <span className="be-kpi-dot" />
            </div>
            <span className="be-kpi-label">
              <TrendingUp size={13} /> TOTAL EN AHORROS
            </span>
            <Money className="be-kpi-value" value={totalAhorro} />
            <span className="be-kpi-sub">{cuentas.length} cuenta(s)</span>
            <button className="be-kpi-link" onClick={() => navigate('/cuentas/ahorro')}>
              Ver detalle <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="be-kpi-card be-kpi-card--deuda">
            <div className="be-kpi-header">
              <span className="be-kpi-icon be-kpi-icon--deuda">
                <CreditCard size={20} />
              </span>
              <span className="be-kpi-dot be-kpi-dot--yellow" />
            </div>
            <span className="be-kpi-label">
              <TrendingDown size={13} /> DEUDA TOTAL DE CRÉDITOS
            </span>
            <Money className="be-kpi-value" value={totalDeuda} />
            <span className="be-kpi-sub">{creditos.length} crédito(s)</span>
            <button className="be-kpi-link be-kpi-link--yellow" onClick={() => navigate('/cuentas/credito')}>
              Gestionar deuda <ArrowDownRight size={14} />
            </button>
          </div>
        </div>

        {/* Cuentas de Ahorro */}
        <div className="be-section">
          <div className="be-section-header">
            <h2>
              <Wallet size={18} />
              Cuentas de Ahorro
            </h2>
            <button className="be-section-link" onClick={() => navigate('/cuentas/ahorro')}>
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="be-section-body">
            {lc ? (
              <Loader text="Cargando cuentas…" />
            ) : cuentas.length === 0 ? (
              <div className="be-empty">
                <Wallet size={40} />
                <p>No registra cuentas de ahorro activas.</p>
              </div>
            ) : (
              <ul className="be-list">
                {cuentas.map((c) => (
                  <li key={c.codcuentaahorro} className="be-list-item" onClick={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}>
                    <div className="be-list-info">
                      <strong>{c.codcuentaahorro}</strong>
                      <small>{c.tipo} · <Badge estado={c.estado} /></small>
                    </div>
                    <div className="be-list-amount">
                      <Money value={c.saldo} simbolo={simboloMoneda(c.moneda)} />
                      <ChevronRight size={16} />
                    </div>
                  </li>
                ))}
                <li className="be-list-total">
                  <span>Saldo disponible total</span>
                  <Money value={totalAhorro} className="be-total-amount" />
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Préstamos */}
        <div className="be-section">
          <div className="be-section-header">
            <h2>
              <CreditCard size={18} />
              Préstamos
            </h2>
            <button className="be-section-link" onClick={() => navigate('/cuentas/credito')}>
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="be-section-body">
            {lk ? (
              <Loader text="Cargando créditos…" />
            ) : creditos.length === 0 ? (
              <div className="be-empty">
                <CreditCard size={40} />
                <p>No registra créditos vigentes.</p>
              </div>
            ) : (
              <ul className="be-list">
                {creditos.map((c) => (
                  <li key={c.codcuentacredito} className="be-list-item" onClick={() => navigate(`/cuentas/credito/${c.codcuentacredito}/cuotas`)}>
                    <div className="be-list-info">
                      <strong>{c.codcuentacredito}</strong>
                      <small>Consumo · <Badge estado={c.calificacion || 'Normal'} tone={c.dias_atraso > 0 ? 'red' : undefined} /></small>
                    </div>
                    <div className="be-list-amount">
                      <Money value={c.pago_pendiente} />
                      <ChevronRight size={16} />
                    </div>
                  </li>
                ))}
                <li className="be-list-total">
                  <span>Saldo pendiente total</span>
                  <Money value={totalDeuda} className="be-total-amount" />
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="be-sidebar">
        {/* Operaciones Frecuentes */}
        <div className="be-sidebar-card">
          <div className="be-sidebar-title">
            <span className="be-sidebar-title-icon" />
            OPERACIONES FRECUENTES
          </div>
          <div className="be-sidebar-actions">
            {acciones.map((a) => (
              <button key={a.to} className="be-action-item" onClick={() => navigate(a.to)}>
                <span className="be-action-icon" style={{ background: `${a.color}15`, color: a.color }}>
                  <a.icon size={18} />
                </span>
                <span className="be-action-label">{a.label}</span>
                <ChevronRight size={16} className="be-action-chevron" />
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Cambio */}
        <div className="be-sidebar-card">
          <div className="be-sidebar-title">
            <span className="be-sidebar-title-icon be-sidebar-title-icon--yellow" />
            Tipo de Cambio
          </div>
          <div className="be-cambio-row">
            <div className="be-cambio-box">
              <small>COMPRA</small>
              <strong>S/ 3,742</strong>
            </div>
            <div className="be-cambio-box">
              <small>VENTA</small>
              <strong>S/ 3,708</strong>
            </div>
          </div>
          <small className="be-cambio-time">Actualizado hace 5 minutos</small>
        </div>

        {/* Ayuda */}
        <div className="be-sidebar-card be-sidebar-card--help">
          <span className="be-help-tag">DESTACADO</span>
          <h3>¿Necesitas ayuda con tus cuentas?</h3>
          <p>Nuestro asistente virtual está disponible 24/7 para resolver tus dudas.</p>
          <button className="be-help-btn">
            <MessageCircle size={16} />
            Chatear con soporte
          </button>
        </div>
      </aside>
    </div>
  )
}

function primerNombre(nombre) {
  if (!nombre) return 'Cliente'
  const parts = nombre.split(',')
  const np = (parts[1] || parts[0]).trim().split(/\s+/)[0]
  return np || 'Cliente'
}
