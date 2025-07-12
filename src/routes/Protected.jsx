// Libraries
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
// Custom Functions
import { api, axiosPrivate } from '../api'
import useRedux from '../hooks/useRedux'
// Laoder
import ScreenLoader from '../loaders/ScreenLoader'
// Utilities
import { isTokenValid } from '../utils'

const Protected = () => {
  const location = useLocation()
  const { setAuth, clearAuth, token } = useRedux()
  const [state, setState] = useState('loading')

  useEffect(() => {
    const routesAuth = async () => {
      if (isTokenValid(token)) {
        setState('valid')
      } else {
        await api(axiosPrivate.get('/api/auth/me'), {
          onSuccess: data => {
            setState('valid')
            setAuth({ user: data?.user })
          },
          onError: () => {
            setState('invalid')
            clearAuth()
          }
        })
      }
    }
    routesAuth()
  }, [token, location.pathname])

  if (state === 'loading') return <ScreenLoader />

  return state === 'valid' ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default Protected
