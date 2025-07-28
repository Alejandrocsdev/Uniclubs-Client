// Libraries
import { jwtDecode } from 'jwt-decode';
// Utilities
import { devErr } from '../utils';

export const isTokenValid = token => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch (error) {
    devErr(error.message || 'Unknown error');
    return false;
  }
};

export const isAllowed = (source, allowedRoles) => {
  try {
    let roles;
    if (typeof source === 'string') {
      roles = jwtDecode(source).roles;
    } else if (Array.isArray(source)) {
      roles = source;
    } else {
      roles = [];
    }

    return roles?.some(role => allowedRoles.includes(role));
  } catch (error) {
    devErr(error.message || 'Unknown error');
    return false;
  }
};
