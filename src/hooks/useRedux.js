// Libraries
import { useDispatch, useSelector } from 'react-redux';
// Custom Functions
import { setCredentials, clearCredentials } from '../redux/authSlice';

const useRedux = () => {
  const dispatch = useDispatch();

  const setAuth = authData => dispatch(setCredentials(authData));

  const clearAuth = () => dispatch(clearCredentials());

  const user = useSelector(state => state.auth.user);

  const token = useSelector(state => state.auth.token);

  return { setAuth, clearAuth, user, token };
};

export default useRedux;
