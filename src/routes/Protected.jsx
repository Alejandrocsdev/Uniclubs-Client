// Libraries
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
// Custom Functions
import { axiosPrivate } from '../api'
import useRedux from '../hooks/useRedux'
// Laoder
import ScreenLoader from '../loaders/ScreenLoader'
// Utilities
import { isTokenValid, devLog, devErr } from '../utils'

const Protected = () => {
  const location = useLocation()
  const { setAuth, clearAuth, token } = useRedux()
  const [state, setState] = useState('loading')

  useEffect(() => {
    const routesAuth = async () => {
      if (isTokenValid(token)) {
        setState('valid')
      } else {
        try {
          devLog('Send [Get Auth User] Request')
          const { data } = await axiosPrivate.get('/api/auth/me')
          devLog('[Get Auth User] Response:', data)
          setState('valid')
          setAuth({ user: data?.user })
        } catch (error) {
          devErr(error.response?.data?.message || 'Unknown error')
          setState('invalid')
          clearAuth()
        }
      }
    }
    routesAuth()
  }, [token, location.pathname])

  if (state === 'loading') return <ScreenLoader />

  return state === 'valid' ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export default Protected
