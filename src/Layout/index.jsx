// CSS Module
import S from './style.module.css'
// Libraries
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className={S.container}>
      <Outlet />
    </div>
  )
}

export default Layout
