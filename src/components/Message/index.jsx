// CSS Module
import S from './style.module.css'
// Libraries
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
// Custom Functions
import { useMessage } from '../../contexts/MessageContext'

function Message() {
  const { message, setMessage } = useMessage()
  const timeoutRef = useRef(null)
  const location = useLocation()

  // Auto-clear the message after 3 seconds
  useEffect(() => {
    if (!message.text) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Start new timeout
    timeoutRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 3000)

    // Cleanup
    return () => clearTimeout(timeoutRef.current)
  }, [message.text])

  // Clear error message immediately on route change
  useEffect(() => {
    if (message.type === 'error') {
      setMessage({ type: '', text: '' })
      clearTimeout(timeoutRef.current)
    }
  }, [location.pathname])

  if (!message.text) return null

  return <div className={S[message.type]}>{message.text}</div>
}

export default Message
