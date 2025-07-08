// CSS Module
import S from './style.module.css'
// Libraries
import { Outlet } from 'react-router-dom'
// Components
import Message from '../../components/Message'

function MainLayout() {
  return (
    <div className={S.container}>
      <Outlet />
    </div>
  )
}

export default MainLayout
