// Libraries
import { useState, useEffect } from 'react'
// Custome Functions
import { axiosPublic } from '../api'
// Utilities
import { devErr } from '../utils'

const useLoader = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 10
    const retryInterval = 2000

    let interval = undefined

    const checkServer = async () => {
      try {
        await axiosPublic.get('/')
        setLoading(false)
        clearInterval(interval)
        return
      } catch (error) {
        devErr(`${error?.message}: failed to connect to server`)
      }

      retryCount++

      if (retryCount >= maxRetries) {
        setLoading(false)
        setError(true)
        clearInterval(interval)
      }
    }

    // Perform the first check immediately on mount
    checkServer() // (0 + 1)
    // Then repeat the check every retryInterval milliseconds
    interval = setInterval(checkServer, retryInterval) // (1 ~ 9 + 1)

    return () => clearInterval(interval)
  }, [])

  return { loading, error }
}

export default useLoader
