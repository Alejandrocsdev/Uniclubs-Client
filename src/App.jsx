// CSS
import './assets/css/global.css'
// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Layout
import Layout from './Layout'
// Public Pages
import Landing from './pages/Landing'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
