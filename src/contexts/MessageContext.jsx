// Libraries
import { createContext, useState, useContext, useMemo } from 'react'

const MessageContext = createContext()

// (1) Provider
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({ type: '', text: '' })

  const setErrMsg = text => setMessage({ type: 'error', text })
  const setSucMsg = text => setMessage({ type: 'success', text })

  const value = useMemo(() => ({ message, setMessage, setErrMsg, setSucMsg }), [message])

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

// (2) Hook
export const useMessage = () => useContext(MessageContext)
