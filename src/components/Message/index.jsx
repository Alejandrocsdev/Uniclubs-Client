// CSS Module
import S from './style.module.css';
// Libraries
import { useEffect, useState } from 'react';
// Custom Functions
import { useMessage } from '../../contexts/MessageContext';

function Message() {
  const { message, clearMessage } = useMessage();
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide animation and auto-clear logic
  useEffect(() => {
    if (!message.text) {
      setIsVisible(false);
      return;
    }

    // Show the message
    setIsVisible(true);

    // Auto-clear after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for fade out animation before clearing
      setTimeout(() => clearMessage(), 300);
    }, 5000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [message.text, clearMessage]);

  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => clearMessage(), 300);
  };

  if (!message.text) return null;

  return (
    <div 
      className={`${S.message} ${S[message.type]} ${isVisible ? S.visible : S.hidden}`}
      onClick={handleClose}
      role="alert"
      aria-live="polite"
    >
      <span className={S.content}>
        {message.text}
      </span>
      <button 
        className={S.closeButton}
        onClick={handleClose}
        aria-label="关闭消息"
      >
        ×
      </button>
    </div>
  );
}

export default Message;
