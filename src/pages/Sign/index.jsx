// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Custom Functions
import { axiosPublic, axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import { useRedux, useUpdateEffect } from '../../hooks'
// Utilities
import { devLog, devErr } from '../../utils'
// Validations
import { signInSchema, signUpSchema } from '../../validations'
// Components
import Form from '../../components/Form'
import Input from '../../components/Input'
import Anchor from '../../components/Anchor'

function Sign({ isSignIn }) {
  const { setSucMsg, setErrMsg } = useMessage()
  const { setAuth, clearAuth } = useRedux()
  const [formExtra, setFormExtra] = useState(null)
  const navigate = useNavigate()

  // Form extra methods
  const { reset, setFocus } = formExtra || {}
  useUpdateEffect(() => reset(), [isSignIn])

  const onSignIn = async formData => {
    try {
      const { username, password } = formData
      devLog('Send [Sign In] Request')
      const { data } = await axiosPrivate.post('/api/auth/sign-in', { username, password })
      devLog('[Sign In] Response', data)
      setAuth({ token: data.accessToken })
      setSucMsg('Sign in successfully.')
      navigate('/')
    } catch (error) {
      if (error.status === 429) {
        setErrMsg('Too many sign in attempts. Please try again later.')
      } else {
        setErrMsg('Sign in failed.')
      }
      reset()
      devErr(error?.response?.data?.message || error?.message || 'Unknown error')
      clearAuth()
    }
  }

  const onSignUp = async formData => {
    try {
      const { username, password, rePassword, email } = formData
      devLog('Send [Sign Up] Request')
      const { data } = await axiosPublic.post('/api/auth/sign-up', { username, password, rePassword, email })
      devLog('[Sign Up] Response', data)
      devLog(data)
      setSucMsg('Sign up successfully.')
      navigate('/sign-in')
    } catch (error) {
      const details = error?.response?.data?.details
      if (error.status === 409 && details?.type === 'unique violation') {
        const { field, value } = details
        const fieldMsgMap = {
          username: `Username ${value} is not available.`,
          email: 'The email you have provided is already associated with an account.'
        }
        setErrMsg(fieldMsgMap[field] || 'Sign up failed.')
        setFocus(field)
      } else {
        setErrMsg('Sign up failed.')
      }
      reset()
      devErr(error?.response?.data?.message || 'Unknown error')
    }
  }

  return (
    <main className={S.main}>
      <div className={S.card}>
        <h2 className={S.cardTitle}>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <Form
          extra={setFormExtra}
          schema={isSignIn ? signInSchema : signUpSchema}
          onSubmit={isSignIn ? onSignIn : onSignUp}
        >
          {/* Username */}
          <Input name="username" placeholder="Please enter your username" maxLength={16} />

          {/* Password */}
          <Input name="password" placeholder="Please enter your password" maxLength={16} />

          {/* Confirm Password */}
          {!isSignIn && <Input name="rePassword" placeholder="Please confirm your password" maxLength={16} />}

          {/* Email */}
          {!isSignIn && <Input name="email" placeholder="Please enter your email" maxLength={254} />}

          {/* Reset Password */}
          {isSignIn && (
            <div className={S.reset}>
              <span className={S.text}>Forgot password?</span>
              <Anchor style={S.link} int="/reset">
                Reset
              </Anchor>
            </div>
          )}

          {/* Submit */}
          <button className={S.submit}>{isSignIn ? 'Sign In' : 'Sign Up'}</button>

          {/* Switch */}
          <div className={S.switch}>
            <span className={S.text}>{isSignIn ? 'New to Uniclubs?' : 'Already have an account?'}</span>
            <Anchor style={S.link} int={isSignIn ? '/sign-up' : '/sign-in'}>
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </Anchor>
          </div>
        </Form>
      </div>
    </main>
  )
}

export default Sign
