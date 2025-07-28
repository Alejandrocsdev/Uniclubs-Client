// CSS Module
import S from './style.module.css';
// Libraries
import { Outlet } from 'react-router-dom';
// Components
import Header from './Header';

function MainLayout() {
  return (
    <>
      <Header />
      <div className={S.container}>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
