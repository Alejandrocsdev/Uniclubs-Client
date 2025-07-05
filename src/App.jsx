// CSS
import './assets/css/font.css'
import './assets/css/global.css'
// Libraries
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Custom Functions
import { MessageProvider } from './contexts/MessageContext'
// Layout
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
// Routes
import ProtectedRoutes from './routes/ProtectedRoutes'
// Public Pages
import Sign from './pages/Sign'
import Reset from './pages/Reset'
// Private Pages
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <MessageProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<Sign isSignIn={true} />} />
            <Route path="/sign-up" element={<Sign isSignIn={false} />} />
            <Route path="/reset" element={<Reset />} />
          </Route>

          {/* Private Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>

          {/* Catch-all fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MessageProvider>
    </BrowserRouter>
  )
}

export default App
