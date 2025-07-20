// CSS
import './assets/css/font.css'
import './assets/css/global.css'
// Libraries
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Custom Functions
import { MessageProvider } from './contexts/MessageContext'
import { useLoader } from './hooks'
// Components
import Error from './components/Error'
import Message from './components/Message'
// Layout
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
// Laoder
import ScreenLoader from './loaders/ScreenLoader'
// Routes
import Protected from './routes/Protected'
// Public Pages
import Sign from './pages/Sign'
import Recovery from './pages/Recovery'
// Private Pages
import Home from './pages/Home'
// Envieonment Variables
// const { MODE } = import.meta.env

function App() {
  const { loading, error } = useLoader()

  if (loading) return <ScreenLoader />

  if (error) return <Error full />

useEffect(() => {
  if (import.meta.env.MODE === 'production') {
    fetch('/api/edge')
      .then(async res => {
        const contentType = res.headers.get('Content-Type')
        if (!res.ok || !contentType?.includes('application/json')) {
          throw new Error('Unexpected response format')
        }
        return res.json()
      })
      .then(data => console.log('Client IP info from Vercel:', data))
      .catch(console.error)
  }
}, [])

  return (
    <BrowserRouter>
      <MessageProvider>
        {/* Global Message */}
        <Message />

        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<Sign />} />
            <Route path="/sign-up" element={<Sign />} />
            <Route path="/recovery/password" element={<Recovery />} />
            <Route path="/recovery/username" element={<Recovery />} />
          </Route>

          {/* Private Routes */}
          <Route element={<Protected />}>
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
