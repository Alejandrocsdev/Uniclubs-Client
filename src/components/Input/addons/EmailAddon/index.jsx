// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
// Custom Functions
import { useCountDown } from '../../../../hooks'
import { api, axiosPublic } from '../../../../api'
import { useMessage } from '../../../../contexts/MessageContext'
// Components
import Submit from '../../../Submit'

function EmailAddon() {
  const { count, isCounting, startCountdown } = useCountDown(60)
  const { setSucMsg, setErrMsg } = useMessage()
  const {
    formState: { errors }
  } = useFormContext()

  const email = useWatch({ name: 'email' })
  const hasError = !!errors.email

  const isDisabled = !email || hasError || isCounting

  const [isSubmitting, setIsSubmitting] = useState(false)

  const OnEmailOtp = async () => {
    if (isDisabled || isSubmitting) return

    setIsSubmitting(true)

    await api(axiosPublic.post('/api/auth/email/otp', { email }), {
      onSuccess: () => {
        setSucMsg('OTP sent successfully.')
      },
      onError: () => {
        setErrMsg('Something went wrong. Please try again.')
      },
      onFinally: () => {
        setIsSubmitting(false)
        startCountdown()
      }
    })
  }

  const getButtonText = () => {
    if (isCounting) return `${count}s`
    if (count === 0) return 'Resend OTP'
    return 'Send OTP'
  }

  return (
    <Submit
      type="button"
      size={6}
      isSubmitting={isSubmitting}
      style={`${S.sendOtp} ${isDisabled ? S.disabled : ''}`}
      onClick={OnEmailOtp}
    >
      {getButtonText()}
    </Submit>
  )
}

export default EmailAddon
