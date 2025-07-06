// CSS Module
import S from './style.module.css'
// Libraries
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// Custom Functions
import { useMessage } from '../../contexts/MessageContext'

function Message() {
  const { message, setMessage } = useMessage()
  const location = useLocation()

  // Auto-clear the message after 3 seconds
  useEffect(() => {
    if (!message.text) return

    // Start new timeout
    const timer = setTimeout(() => setMessage({ type: '', text: '', time: 0 }), 5000)

    // Cleanup
    return () => clearTimeout(timer)
  }, [message.text, message.time])

  // Clear error message immediately on route change
  useEffect(() => {
    if (message.type === 'error') {
      setMessage({ type: '', text: '', time: 0 })
    }
  }, [location.pathname])

  if (!message.text) return null

  return <div className={`${S.message} ${S[message.type]}`}>{message.text}</div>
}

export default Message
