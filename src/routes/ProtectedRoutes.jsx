// Libraries
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
// Custom Functions
import { axiosPrivate } from '../api'
import useRedux from '../hooks/useRedux'
// Utilities
import { isTokenExpired, devLog, devErr } from '../utils'

const ProtectedRoutes = () => {
  const location = useLocation()
  const { setAuth, clearAuth, token } = useRedux()
  const [state, setState] = useState('loading')

  useEffect(() => {
    const routesAuth = async () => {
      if (token && !isTokenExpired(token)) {
        setState('valid')
      } else {
        try {
          devLog('Send [Get Auth User] Request')
          const { data } = await axiosPrivate.get('/api/auth/me')
          devLog('[Get Auth User] Response')
          devLog(data)
          setAuth({ user: data?.user })
        } catch (error) {
          devErr(error?.response?.data?.message || 'Unknown error')
          clearAuth()
          setState('invalid')
        }
      }
    }
    routesAuth()
  }, [token, location.pathname])

  if (state === 'loading') return null

  return state === 'valid' ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default ProtectedRoutes
