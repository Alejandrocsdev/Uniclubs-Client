// Libraries
import { jwtDecode } from 'jwt-decode'
// Utilities
import { devErr } from '../utils'

export const isTokenExpired = token => {
  try {
    const { exp } = jwtDecode(token)
    return exp * 1000 < Date.now()
  } catch (error) {
    devErr(error)
    return true
  }
}
