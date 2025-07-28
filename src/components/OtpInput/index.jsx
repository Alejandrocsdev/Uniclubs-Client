// CSS Module
import S from './style.module.css';
// Libraries
import { useRef, useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const OtpInput = ({ length = 6, name }) => {
  // const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const otp = useWatch({ name }) || '';
  const error = errors[name]?.message;

  const sanitizeOtp = str => str.replace(/\D/g, '').slice(0, length);
  const setValueConfig = { shouldValidate: true, shouldDirty: true };

  const handleChange = event => {
    const value = sanitizeOtp(event.target.value);
    setValue(name, value, setValueConfig);
  };

  const handlePaste = event => {
    event.preventDefault();
    const pasted = sanitizeOtp(event.clipboardData.getData('text'));
    setValue(name, pasted, setValueConfig);
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const focusIndex = Math.min(otp.length, length - 1);

  return (
    <div className={S.inputContainer}>
      <div className={S.otpSlots}>
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={`${S.otpSlot} ${isFocused && index === focusIndex ? S.focus : ''}`}
          >
            {otp[index] ||
              (isFocused && index === focusIndex && (
                <span className={S.caret} />
              ))}
          </div>
        ))}
      </div>

      {/* Single hidden but focused input */}
      <input
        {...register(name)}
        type="text"
        name={name}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={otp}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={S.otpInput}
      />

      {/* Input Error */}
      {error && <div className={S.inputError}>{error}</div>}
    </div>
  );
};

export default OtpInput;
