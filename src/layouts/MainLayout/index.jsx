// CSS Module
import S from './style.module.css'
// Libraries
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className={S.container}>
      <Outlet />
    </div>
  )
}

export default MainLayout
