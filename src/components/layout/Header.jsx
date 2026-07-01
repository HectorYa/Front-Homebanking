import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, UserCog, Eye, EyeOff, ChevronDown, Sun, Moon } from 'lucide-react'
import { useHBAuth } from '../../hooks/useHBAuth.js'
import { useUI } from '../../context/UIContext.jsx'

const NAV_LINKS = [
  { label: 'Personas', active: true },
  { label: 'Empresas', active: false },
  { label: 'Nosotros', active: false },
  { label: 'Ayuda', active: false },
]

export default function Header() {
  const { user, logout } = useHBAuth()
  const { hideAmounts, toggleHideAmounts, isDark, toggleTheme } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuUser, setMenuUser] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMenuUser(false) }, [location.pathname])
  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const iniciales = (user?.nombre || 'C')
    .split(/[\s,]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()

  return (
    <header className={`be-header ${mounted ? 'be-header--visible' : ''}`}>
      <div className="be-header-inner">
        <div className="be-header-left">
          <button className="be-brand" onClick={() => navigate('/inicio')} aria-label="Inicio">
            <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="var(--brand-red)" transform="rotate(0 24 24)" opacity="0.95" />
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="#f7941e" transform="rotate(60 24 24)" opacity="0.95" />
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="var(--brand-yellow)" transform="rotate(120 24 24)" opacity="0.95" />
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="#4caf50" transform="rotate(180 24 24)" opacity="0.95" />
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="#00a9a5" transform="rotate(240 24 24)" opacity="0.95" />
              <ellipse cx="24" cy="13" rx="6" ry="11" fill="#8e24aa" transform="rotate(300 24 24)" opacity="0.95" />
              <circle cx="24" cy="24" r="7" fill="var(--brand-yellow)" />
              <circle cx="24" cy="24" r="3.4" fill="var(--brand-red)" />
            </svg>
            <span className="be-brand-name">Financiera Surgir</span>
          </button>

          <nav className="be-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href="#" className={`be-nav-link ${link.active ? 'active' : ''}`}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="be-header-right">
          <button className="be-hide-toggle" onClick={toggleHideAmounts} title="Ocultar importes">
            {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button className="be-theme-toggle" onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            <span className={`be-theme-track ${isDark ? 'dark' : ''}`}>
              <span className="be-theme-thumb">
                {isDark ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </span>
          </button>

          <div className="be-user-wrap">
            <button className="be-user-btn" onClick={() => setMenuUser((v) => !v)}>
              <span className="be-avatar">{iniciales}</span>
              <span className="be-user-info">
                <strong>{user?.nombre || 'Cliente'}</strong>
                <small>{user?.codcliente}</small>
              </span>
              <ChevronDown size={14} className={`be-chevron ${menuUser ? 'open' : ''}`} />
            </button>
            {menuUser && (
              <div className="be-user-menu">
                <button onClick={() => navigate('/inicio')}>
                  <UserCog size={16} /> Mis datos
                </button>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Salir
                </button>
              </div>
            )}
          </div>

          <button className="be-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
