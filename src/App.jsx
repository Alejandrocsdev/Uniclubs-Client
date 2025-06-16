// CSS
import './assets/css/global.css'
// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Layout
import Layout from './Layout'
// Public Pages
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
