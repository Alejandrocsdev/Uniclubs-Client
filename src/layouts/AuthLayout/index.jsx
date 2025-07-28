// CSS Module
import S from './style.module.css';
// Libraries
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className={S.container}>
      <div className={S.layer}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
