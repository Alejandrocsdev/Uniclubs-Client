// CSS Module
import S from './style.module.css'
// Libraries
import { useState, useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

const OtpInput = ({ length = 6, name }) => {
  const inputRefs = useRef([])
  const [otp, setOtp] = useState(new Array(length).fill(''))

  const {
    register,
    setValue,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message
  const watchedOtp = useWatch({ name })

  // Reset OTP inputs
  useEffect(() => {
    if (!watchedOtp) setOtp(new Array(length).fill(''))
  }, [watchedOtp])

  // Handle input value change
  const onChange = (index, event) => {
    const { value } = event.target
    // Ignore non-numeric input
    if (isNaN(value)) return

    const newOtp = [...otp]
    // // Only keep the last digit
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Update hidden input for react-hook-form
    setValue(name, newOtp.join(''), { shouldValidate: true, shouldDirty: true })

    // Focus the next input if available
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Handle input click to position cursor
  const onClick = index => {
    inputRefs.current[index].setSelectionRange(1, 1)

    // If previous input is empty, focus the first empty input instead
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf('')].focus()
    }
  }

  // Handle backspace to go to previous input
  const onKeyDown = (index, event) => {
    // (1): Only trigger logic when Backspace key is pressed
    // (2): Current input is empty (nothing to delete)
    // (3): Not the first input (has a previous input to go back to)
    // (4): The previous input exists (is mounted and accessible)
    if (event.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Focus the previous input when Backspace is pressed and current input is empty
      inputRefs.current[index - 1].focus()
    }
  }

  // Handle paste event (fill OTP inputs with pasted digits)
  const onPaste = event => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text')

    // Filter only numeric characters (ignore letters or symbols)
    const pastedDigits = Array.from(pasted).filter(char => char >= '0' && char <= '9')

    // If no digits are found, exit the function
    if (pastedDigits.length === 0) return

    // Create a copy of the current OTP state
    const otpArray = [...otp]

    // Fill in each OTP input with the pasted digits, up to the maximum length
    for (let i = 0; i < length; i++) {
      otpArray[i] = pastedDigits[i] || ''
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pastedDigits[i] || ''
      }
    }

    setOtp(otpArray)
    setValue(name, otpArray.join(''), { shouldValidate: true, shouldDirty: true })

    // Automatically focus on the next empty input (if any)
    const nextIndex = otpArray.findIndex(value => value === '')
    if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus()
    }
  }

  return (
    <div className={S.inputContainer}>
      <div className={S.otpContainer}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            className={S.otpInput}
            ref={input => (inputRefs.current[index] = input)}
            value={value}
            onClick={() => onClick(index)}
            onChange={event => onChange(index, event)}
            onKeyDown={event => onKeyDown(index, event)}
            onPaste={onPaste}
          />
        ))}
        <input type="hidden" {...register(name)} />
      </div>

      {/* Input Error */}
      {error && <div className={S.inputError}>{error}</div>}
    </div>
  )
}

export default OtpInput
