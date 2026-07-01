import { useState, useEffect } from 'react'
import { MessageCircle, Plus, ChevronDown, Clock, CheckCircle, XCircle } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout.jsx'
import { getReclamos, crearReclamo } from '../services/reclamosService.js'

const TIPOS = ['RECLAMO', 'QUEJA', 'CONSULTA']
const ESTADO_ICON = { Pendiente: Clock, Resuelto: CheckCircle, Cerrado: XCircle }
const ESTADO_COLOR = { Pendiente: 'var(--warning)', Resuelto: 'var(--success)', Cerrado: 'var(--hb-muted)' }

export default function ReclamosPage() {
  const [reclamos, setReclamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [asunto, setAsunto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('RECLAMO')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getReclamos().then(res => setReclamos(res.reclamos || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (asunto.length < 5) { setError('El asunto debe tener al menos 5 caracteres'); return }
    if (descripcion.length < 10) { setError('La descripción debe tener al menos 10 caracteres'); return }
    setSaving(true)
    setError('')
    try {
      await crearReclamo({ asunto, descripcion, tipo })
      setAsunto('')
      setDescripcion('')
      setShowForm(false)
      load()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error al crear reclamo')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageLayout
      title="Mis Reclamos"
      subtitle="Reclamos, quejas y consultas › Registra y da seguimiento"
      actions={
        <button className="hb-btn hb-btn--primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancelar' : 'Nuevo reclamo'}
        </button>
      }
    >
      {showForm && (
        <div className="hb-card" style={{ marginBottom: 20 }}>
          <div className="hb-card-title"><MessageCircle size={18} /> Nuevo reclamo</div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Tipo</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--hb-border)', fontSize: 14 }}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Asunto</label>
              <input value={asunto} onChange={e => setAsunto(e.target.value)} maxLength={200}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--hb-border)', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} maxLength={2000} rows={4}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--hb-border)', fontSize: 14, resize: 'vertical' }} />
            </div>
            {error && <p style={{ color: 'var(--error)', fontSize: 13, margin: '0 0 10px' }}>{error}</p>}
            <button type="submit" className="hb-btn hb-btn--primary" disabled={saving}>
              {saving ? 'Registrando…' : 'Registrar reclamo'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="hb-loader"><div className="hb-spinner" /><span>Cargando reclamos…</span></div>
      ) : reclamos.length === 0 ? (
        <div className="hb-card"><p style={{ textAlign: 'center', color: 'var(--hb-muted)', margin: 0 }}>No tienes reclamos registrados.</p></div>
      ) : (
        reclamos.map(r => {
          const Icon = ESTADO_ICON[r.estado] || Clock
          return (
            <div key={r.id} className="hb-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{r.asunto}</strong>
                  <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--hb-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>{r.tipo}</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: ESTADO_COLOR[r.estado] || 'var(--hb-muted)' }}>
                  <Icon size={14} /> {r.estado}
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--hb-muted)', margin: '0 0 8px' }}>{r.descripcion}</p>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Creado: {r.fecha_creacion}
                {r.fecha_resolucion && <> · Resuelto: {r.fecha_resolucion}</>}
              </div>
              {r.respuesta && (
                <div style={{ marginTop: 8, padding: 10, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13 }}>
                  <strong>Respuesta:</strong> {r.respuesta}
                </div>
              )}
            </div>
          )
        })
      )}
    </PageLayout>
  )
}
