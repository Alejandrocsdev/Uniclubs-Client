// Libraries
import { createContext, useState, useContext, useMemo, useCallback } from 'react';

const MessageContext = createContext();

// (1) Provider
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({ type: '', text: '' });

  const setErrMsg = useCallback((text) => {
    setMessage({ type: 'error', text: text || '发生了错误' });
  }, []);

  const setSucMsg = useCallback((text) => {
    setMessage({ type: 'success', text: text || '操作成功' });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage({ type: '', text: '' });
  }, []);

  const value = useMemo(
    () => ({ 
      message, 
      setMessage, 
      setErrMsg, 
      setSucMsg, 
      clearMessage 
    }),
    [message, setErrMsg, setSucMsg, clearMessage]
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

// (2) Hook with error handling
export const useMessage = () => {
  const context = useContext(MessageContext);
  
  if (!context) {
    throw new Error('useMessage 必须在 MessageProvider 内部使用');
  }
  
  return context;
};
