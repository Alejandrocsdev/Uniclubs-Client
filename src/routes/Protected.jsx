// Libraries
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Custom Functions
import { api, axiosPrivate } from '../api';
import useRedux from '../hooks/useRedux';
// Laoder
import ScreenLoader from '../loaders/ScreenLoader';
// Utilities
import { isTokenValid, isAllowed } from '../utils';

const Protected = ({ allowedRoles }) => {
  const location = useLocation();
  const { setAuth, clearAuth, token } = useRedux();
  const [state, setState] = useState('loading');

  useEffect(() => {
    const routesAuth = async () => {
      if (isTokenValid(token) && isAllowed(token, allowedRoles)) {
        isAllowed(token, allowedRoles)
          ? setState('valid')
          : setState('invalid');
      } else {
        await api(axiosPrivate.get('/api/auth/me'), {
          onSuccess: data => {
            const roles = data?.user?.roles || [];
            if (isAllowed(roles, allowedRoles)) {
              setState('valid');
              setAuth({ user: data?.user });
            } else {
              setState('invalid');
              clearAuth();
            }
          },
          onError: () => {
            setState('invalid');
            clearAuth();
          },
        });
      }
    };
    routesAuth();
  }, [token, location.pathname]);

  if (state === 'loading') return <ScreenLoader />;

  return state === 'valid' ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default Protected;
