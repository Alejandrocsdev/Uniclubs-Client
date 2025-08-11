// Libraries
import axios from 'axios';

// Custom Functions
import { store } from '../redux/store.js';
import { setCredentials, clearCredentials } from '../redux/authSlice.js';

// Utilities
import { serverUrl, devLog, devErr } from '../utils';

// Public
export const axiosPublic = axios.create({ baseURL: serverUrl });

// Private
export const axiosPrivate = axios.create({
  baseURL: serverUrl,
  withCredentials: true
});

// Refresh Token
const refreshToken = () => axios.post(
  `${serverUrl}/api/auth/refresh`,
  {},
  { withCredentials: true }
);

// Request Interceptor
axiosPrivate.interceptors.request.use(
  request => {
    devLog('Intercepted request:', request);

    // Inject Authorization header if token exists
    const token = store.getState().auth.token;
    if (token) request.headers['Authorization'] = `Bearer ${token}`;

    return request;
  },
  error => Promise.reject(error)
);

// Response Interceptor
axiosPrivate.interceptors.response.use(
  response => {
    devLog('Intercepted response:', response);
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest.retry) {
      devErr(error.response?.data?.message || error.message || 'Unknown error');

      // Mark request as retried to prevent infinite loop
      originalRequest.retry = true;

      try {
        devLog('Requesting new access token...');
        const { data } = await refreshToken();
        devLog('Received new access token:', data);
        const newToken = data.accessToken;

        // Update Redux state with new token
        store.dispatch(setCredentials({ token: newToken }));

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        devLog('Resending original request with new token...');
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        // Clear credentials and force sign out
        store.dispatch(clearCredentials());

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      devErr(error.response?.data?.message || error.message || 'Unknown error');

      // Clear credentials and force sign out
      store.dispatch(clearCredentials());
    }

    return Promise.reject(error);
  }
);
