// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// Custom Functions
import { api, axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import { useRedux, useUpdateEffect } from '../../hooks'
// Validations
import { signInSchema, signUpSchema } from '../../validations'
// Components
import Card from '../../components/Card'
import Form from '../../components/Form'
import Input from '../../components/Input'
import Anchor from '../../components/Anchor'
import OtpInput from '../../components/OtpInput'
import Submit from '../../components/Submit'

function Sign() {
  const [formExtra, setFormExtra] = useState(null)
  const { setSucMsg, setErrMsg } = useMessage()
  const { clearAuth } = useRedux()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isSignIn = pathname === '/sign-in'

  // Form extra methods
  const { reset, resetField, setFocus, isSubmitting } = formExtra || {}
  useUpdateEffect(() => reset(), [isSignIn])

  const onSignIn = async formData => {
    await api(axiosPrivate.post('/api/auth/sign-in', formData), {
      onSuccess: () => {
        setSucMsg('Sign in successfully.')
        navigate('/')
      },
      onError: error => {
        if (error.status === 429) {
          setErrMsg('Too many sign in attempts. Please try again later.')
        } else {
          setErrMsg('Sign in failed.')
        }
        clearAuth()
        reset()
      }
    })
  }

  const onSignUp = async formData => {
    await api(axiosPrivate.post('/api/auth/sign-up', formData), {
      onSuccess: () => {
        setSucMsg('Sign up successfully.')
        navigate('/sign-in')
      },
      onError: error => {
        const { type, field, value } = error.response?.data?.details || {}
        if (error.status === 409 && type === 'unique violation') {
          const messages = {
            username: `Username "${value}" is not available.`,
            email: 'The email you have provided is already associated with an account.'
          }
          setErrMsg(messages[field] || 'Sign up failed.')
          resetField(field)
          setFocus(field)
        } else if (error.status === 400 && type === 'otp failure') {
          setErrMsg('OTP verification failed or expired.')
          resetField('otp')
          setFocus('otp')
        } else {
          setErrMsg('Sign up failed.')
          reset()
        }
      }
    })
  }

  return (
    <Card title={isSignIn ? 'Sign In' : 'Sign Up'}>
      <Form
        extra={setFormExtra}
        schema={isSignIn ? signInSchema : signUpSchema}
        onSubmit={isSignIn ? onSignIn : onSignUp}
      >
        {/* Username */}
        <Input name="username" placeholder="Username" maxLength={16} />

        {/* Password */}
        <Input name="password" placeholder="Password" maxLength={16} />

        {/* Confirm Password */}
        {!isSignIn && <Input name="rePassword" placeholder="Repeat password" maxLength={16} />}

        {/* Email */}
        {!isSignIn && <Input name="email" placeholder="Email" maxLength={254} />}

        {/* OTP */}
        {!isSignIn && <OtpInput name="otp" />}

        {/* Reset Password */}
        {isSignIn && (
          <Anchor style={S.recoverLink} int="/recovery/password">
            Forgot password?
          </Anchor>
        )}

        {/* Submit */}
        <Submit loaderSize={10} isSubmitting={isSubmitting}>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </Submit>

        {/* Switch */}
        <div className={S.switch}>
          <span className={S.switchText}>{isSignIn ? 'New to Uniclubs?' : 'Already have an account?'}</span>
          <Anchor style={S.switchLink} int={isSignIn ? '/sign-up' : '/sign-in'}>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </Anchor>
        </div>
      </Form>
    </Card>
  )
}

export default Sign
