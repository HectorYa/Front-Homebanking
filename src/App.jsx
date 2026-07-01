import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/layout/PrivateRoute.jsx'
import Header from './components/layout/Header.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SimuladorPage from './pages/SimuladorPage.jsx'
import PreCalificadorPage from './pages/PreCalificadorPage.jsx'
import TarifariosPage from './pages/TarifariosPage.jsx'
import HomePage from './pages/HomePage.jsx'
import CuentasAhorroPage from './pages/CuentasAhorroPage.jsx'
import MovimientosPage from './pages/MovimientosPage.jsx'
import CuentasCreditoPage from './pages/CuentasCreditoPage.jsx'
import CuotasCreditoPage from './pages/CuotasCreditoPage.jsx'
import OperacionesPage from './pages/OperacionesPage.jsx'
import TransferenciaPage from './pages/TransferenciaPage.jsx'
import PagoCreditoPage from './pages/PagoCreditoPage.jsx'
import PagoServiciosPage from './pages/PagoServiciosPage.jsx'
import SolicitarCreditoPage from './pages/SolicitarCreditoPage.jsx'
import ReclamosPage from './pages/ReclamosPage.jsx'

// Layout para las rutas autenticadas: cabecera Financiera Surgir + contenido.
function PrivateLayout({ children }) {
  return (
    <PrivateRoute>
      <Header />
      <main style={{ background: '#f8f6f7', minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </main>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/simulador" element={<SimuladorPage />} />
      <Route path="/precalificador" element={<PreCalificadorPage />} />
      <Route path="/tarifarios" element={<TarifariosPage />} />

      {/* Privadas */}
      <Route path="/inicio" element={<PrivateLayout><HomePage /></PrivateLayout>} />
      <Route path="/cuentas/ahorro" element={<PrivateLayout><CuentasAhorroPage /></PrivateLayout>} />
      <Route path="/cuentas/ahorro/:cod/movimientos" element={<PrivateLayout><MovimientosPage /></PrivateLayout>} />
      <Route path="/cuentas/credito" element={<PrivateLayout><CuentasCreditoPage /></PrivateLayout>} />
      <Route path="/cuentas/credito/:cod/cuotas" element={<PrivateLayout><CuotasCreditoPage /></PrivateLayout>} />

      <Route path="/operaciones" element={<PrivateLayout><OperacionesPage /></PrivateLayout>} />
      <Route path="/operaciones/transferencia" element={<PrivateLayout><TransferenciaPage /></PrivateLayout>} />
      <Route path="/operaciones/pago-credito" element={<PrivateLayout><PagoCreditoPage /></PrivateLayout>} />
      <Route path="/operaciones/pago-credito/:cod" element={<PrivateLayout><PagoCreditoPage /></PrivateLayout>} />
      <Route path="/operaciones/pago-servicios" element={<PrivateLayout><PagoServiciosPage /></PrivateLayout>} />
      <Route path="/creditos/solicitar" element={<PrivateLayout><SolicitarCreditoPage /></PrivateLayout>} />
      <Route path="/reclamos" element={<PrivateLayout><ReclamosPage /></PrivateLayout>} />

      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}
