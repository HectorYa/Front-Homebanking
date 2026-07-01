import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { CreditCard, Eye, EyeOff, ArrowLeft, Shield, Lock } from 'lucide-react'
import { useHBAuth } from '../hooks/useHBAuth.js'
import { extractError } from '../utils/format.js'
import Alert from '../components/ui/Alert.jsx'

export default function LoginPage() {
  const { login, isAuthenticated } = useHBAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tarjeta, setTarjeta] = useState(location.state?.tarjeta || '')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!/^\d{8}$/.test(dni.trim())) {
      setError('Ingresa un DNI válido de 8 dígitos.')
      return
    }

    setLoading(true)
    try {
      await login(tarjeta.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className={`login-left ${mounted ? 'login-left--visible' : ''}`}>
        <div className="login-mountains">
          <div className="mountain mountain-1"></div>
          <div className="mountain mountain-2"></div>
          <div className="mountain mountain-3"></div>
          <div className="aurora"></div>
          <div className="aurora aurora-2"></div>
          <div className="stars">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`star star-${i + 1}`}></div>
            ))}
          </div>
        </div>

        <div className="login-left-content">
          <div className="login-brand">
            <span className="login-brand-tag">TRADICIÓN EN CADA CLICK</span>
            <h1>
              Amanecer de{' '}
              <span className="login-brand-highlight">Tradición Web</span>
            </h1>
            <p>
              Gestiona tu patrimonio con la seguridad de siempre y la rapidez
              de hoy. Tu energía impulsa el Perú.
            </p>
          </div>

          <div className="login-security-badges">
            <div className="security-badge">
              <div className="security-badge-icon">128-bit</div>
              <span>ENCRYPTION STANDARD</span>
            </div>
            <div className="security-badge">
              <div className="security-badge-icon">ISO 27001</div>
              <span>CERTIFIED SECURE</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`login-right ${mounted ? 'login-right--visible' : ''}`}>
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-card-logo">
              <svg width="36" height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#e6398b" transform="rotate(0 24 24)" opacity="0.95" />
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#f7941e" transform="rotate(60 24 24)" opacity="0.95" />
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#fbc02d" transform="rotate(120 24 24)" opacity="0.95" />
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#4caf50" transform="rotate(180 24 24)" opacity="0.95" />
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#00a9a5" transform="rotate(240 24 24)" opacity="0.95" />
                <ellipse cx="24" cy="13" rx="6" ry="11" fill="#8e24aa" transform="rotate(300 24 24)" opacity="0.95" />
                <circle cx="24" cy="24" r="7" fill="#fbc02d" />
                <circle cx="24" cy="24" r="3.4" fill="#e2132b" />
              </svg>
              <div className="login-card-brand">
                <span className="login-card-name">Financiera Surgir</span>
              </div>
            </div>
          </div>

          <div className="login-nav">
            <a href="#" className="login-nav-link active">Personas</a>
            <a href="#" className="login-nav-link">Empresas</a>
            <a href="#" className="login-nav-link">Nosotros</a>
            <a href="#" className="login-nav-link">Ayuda</a>
          </div>

          <div className="login-card-body">
            <h2>Banca por Internet</h2>
            <p className="login-card-subtitle">
              Bienvenido a tu espacio financiero seguro.
            </p>

            <Alert tipo="error">{error}</Alert>

            <form onSubmit={onSubmit} className="login-form">
              <div className="login-field">
                <label>N° de Tarjeta de Ahorros</label>
                <div className="login-input-wrap">
                  <CreditCard size={18} className="login-input-icon" />
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Ej. cli000001"
                    autoComplete="username"
                    value={tarjeta}
                    onChange={(e) => setTarjeta(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Tipo y Número de Documento</label>
                <div className="login-field-row">
                  <select className="login-select" defaultValue="DNI">
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Ingresa tu número"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Contraseña de Internet</label>
                <div className="login-input-wrap">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-extras">
                <label className="login-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Recordar datos</span>
                </label>
                <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner"></span>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>

            <div className="login-secured">
              <Shield size={14} />
              <span>Secured by 256-bit encryption</span>
            </div>
          </div>
        </div>

        <Link to="/" className="login-back">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
