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
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<Sign isSignIn={true} />} />
            <Route path="/sign-up" element={<Sign isSignIn={false} />} />
            <Route path="/reset" element={<Reset />} />
          </Route>

          {/* Main routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Catch-all fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MessageProvider>
    </BrowserRouter>
  )
}

export default App
