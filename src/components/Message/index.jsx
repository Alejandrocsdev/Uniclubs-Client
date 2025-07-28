// CSS Module
import S from './style.module.css';
// Libraries
import { useEffect } from 'react';
// Custom Functions
import { useMessage } from '../../contexts/MessageContext';

function Message() {
  const { message, setMessage } = useMessage();

  // Auto-clear the message after 3 seconds
  useEffect(() => {
    if (!message.text) return;

    // Start new timeout
    const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [message.text]);

  if (!message.text) return null;

  return (
    <div className={`${S.message} ${S[message.type]}`}>{message.text}</div>
  );
}

export default Message;
