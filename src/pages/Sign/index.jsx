// CSS Module
import S from './style.module.css'
// Libraries
import { useNavigate } from 'react-router-dom'
// Custom Functions
import { axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import useRedux from '../../hooks/useRedux'
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
  const navigate = useNavigate()

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
      devErr(error?.response?.data?.message || 'Unknown error')
      setErrMsg('Sign in failed.')
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
      devErr(error?.response?.data?.message || 'Unknown error')
      setErrMsg('Sign up failed.')
    }
  }

  return (
    <main className={S.main}>
      <div className={S.card}>
        <h2 className={S.cardTitle}>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <Form schema={isSignIn ? signInSchema : signUpSchema} onSubmit={isSignIn ? onSignIn : onSignUp}>
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
