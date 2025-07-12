// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Custom Functions
import { api, axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import { useRedux, useUpdateEffect } from '../../hooks'
// Validations
import { signInSchema, signUpSchema } from '../../validations'
// Components
import Form from '../../components/Form'
import Input from '../../components/Input'
import Anchor from '../../components/Anchor'

function Sign({ isSignIn }) {
  const [formExtra, setFormExtra] = useState(null)
  const { setSucMsg, setErrMsg } = useMessage()
  const { clearAuth } = useRedux()
  const navigate = useNavigate()

  // Form extra methods
  const { reset, setFocus } = formExtra || {}
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
        const { type, field, value } = details
        if (error.status === 409 && type === 'unique violation') {
          const messages = {
            username: `Username ${value} is not available.`,
            email: 'The email you have provided is already associated with an account.'
          }
          setErrMsg(messages[field] || 'Sign up failed.')
          setFocus(field)
        } else {
          setErrMsg('Sign up failed.')
        }
        reset()
      }
    })
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

      <Anchor style={S.link} int="/">
        Home
      </Anchor>
    </main>
  )
}

export default Sign
