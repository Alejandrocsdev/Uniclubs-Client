// 函式庫 (library)
import { useState, useEffect } from 'react';

const useCountdown = (initialCount, onFinish = () => {}) => {
  const [count, setCount] = useState(initialCount);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let timer;
    // 倒數中
    if (isCounting && count > 0) {
      timer = setInterval(() => {
        setCount(prevCount => prevCount - 1);
      }, 1000);
    }
    // 歸零
    else if (count === 0) {
      // 歸零就觸發
      onFinish();
      setIsCounting(false);
    }

    return () => clearInterval(timer);
  }, [isCounting, count]);

  // 倒數開始
  const startCountdown = () => {
    setCount(initialCount);
    setIsCounting(true);
  };

  // 倒數暫停
  // const stopCountdown = () => {
  //   setIsCounting(false)
  // }

  // 倒數重置
  // const resetCountdown = () => {
  //   setCount(initialCount)
  //   setIsCounting(false)
  // }

  return {
    count,
    isCounting,
    startCountdown,
    // stopCountdown,
    // resetCountdown
  };
};

export default useCountdown;
