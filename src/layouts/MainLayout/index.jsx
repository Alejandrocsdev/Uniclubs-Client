// CSS Module
import S from './style.module.css';
// Libraries
import { Outlet } from 'react-router-dom';
// Components
import Header from './Header';
import { Toaster } from 'sonner';

function MainLayout() {
  return (
    <>
      <Header />
      <div className={S.container}>
        <Outlet />
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default MainLayout;
