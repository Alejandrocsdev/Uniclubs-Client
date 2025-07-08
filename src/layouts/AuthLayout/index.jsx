// CSS Module
import S from './style.module.css'
// Libraries
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className={S.container}>
      <Outlet />
    </div>
  )
}

export default AuthLayout
