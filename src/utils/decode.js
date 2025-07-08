// Libraries
import { jwtDecode } from 'jwt-decode'
// Utilities
import { devErr } from '../utils'

export const isTokenValid = token => {
  if (!token) return false

  try {
    const { exp } = jwtDecode(token)
    return exp * 1000 > Date.now()
  } catch (error) {
    console.log('isTokenValid:', error.message)
    devErr(error)
    return false
  }
}
