// CSS Module
import S from './style.module.css'
// Libraries
import { useFormContext, useWatch } from 'react-hook-form'
// Custom Functions
import { useCountDown } from '../../../../hooks'
import { api, axiosPublic } from '../../../../api'
import { useMessage } from '../../../../contexts/MessageContext'

function EmailAddon() {
  const { count, isCounting, startCountdown } = useCountDown(60)
  const { setSucMsg, setErrMsg } = useMessage()
  const {
    formState: { errors }
  } = useFormContext()

  const email = useWatch({ name: 'email' })
  const hasError = !!errors.email

  const isDisabled = !email || hasError || isCounting

  const OnEmailOtp = async () => {
    if (isDisabled) return

    await api(axiosPublic.post('/api/auth/email/otp', { email }), {
      onSuccess: () => setSucMsg('OTP sent successfully.'),
      onError: () => setErrMsg('Something went wrong. Please try again.')
    })
    startCountdown()
  }

  const getButtonText = () => {
    if (isCounting) return `${count}s`
    if (count === 0) return 'Resend OTP'
    return 'Send OTP'
  }

  return (
    <div className={`${S.sendOtp} ${isDisabled ? S.disabled : ''}`} onClick={OnEmailOtp}>
      {getButtonText()}
    </div>
  )
}

export default EmailAddon
