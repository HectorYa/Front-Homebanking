import { useNavigate } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

const COLS = [
  {
    title: 'Productos',
    links: [
      { label: 'Cuenta de Ahorros', to: '/login' },
      { label: 'Cuenta Sueldo', to: '/login' },
      { label: 'Crédito de Consumo', to: '/login' },
      { label: 'Crédito Microempresa', to: '/login' },
      { label: 'Tarjeta de Débito', to: '/login' },
    ],
  },
  {
    title: 'Banco Andino',
    links: [
      { label: 'Nosotros', to: '/' },
      { label: 'Tasas y tarifas', to: '/tarifarios' },
      { label: 'Transparencia', to: '/tarifarios' },
      { label: 'Sala de prensa', to: '/' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Centro de ayuda', to: '/' },
      { label: 'Ubícanos', to: '/' },
      { label: 'Reclamos', to: '/reclamos' },
      { label: 'Libro de reclamaciones', to: '/reclamos' },
    ],
  },
]

export default function PublicFooter() {
  const navigate = useNavigate()
  return (
    <footer className="lp-footer" id="footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Logo size={40} variant="light" subtitle="BANCA DIGITAL" />
          <p>Tu banco digital inspirado en los Andes. Operaciones 100% en línea, seguras y a tu alcance.</p>
          <div className="lp-social">
            <a href="#footer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#footer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#footer" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>

        {COLS.map((c) => (
          <div className="lp-footer-col" key={c.title}>
            <h4>{c.title}</h4>
            <ul>
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.to.startsWith('/') ? undefined : l.to}
                     onClick={l.to.startsWith('/') ? (e) => { e.preventDefault(); navigate(l.to) } : undefined}
                     style={{ cursor: 'pointer' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lp-footer-col">
          <h4>Contacto</h4>
          <ul className="lp-contact">
            <li><Phone size={15} /> Banca telefónica: (01) 311-9000</li>
            <li><Mail size={15} /> contacto@bancoandino.pe</li>
            <li><MapPin size={15} /> Av. Los Andes 123, Lima</li>
          </ul>
        </div>
      </div>

      <div className="hb-franja-top" />
      <div className="lp-footer-legal">
        &copy; {2026} Banco Andino — Banca por Internet. Demo educativo. Supervisado por la SBS.
      </div>
    </footer>
  )
}
