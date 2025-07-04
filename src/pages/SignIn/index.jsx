// CSS Module
import S from './style.module.css'
// Libraries
import { useNavigate } from 'react-router-dom'
// Custom Functions
import { axiosPublic } from '../../../api'
import { useMessage } from '../../contexts/MessageContext'
// Validations
import { signInSchema } from '../../validations'
// Utilities
import { devLog, devErr } from '../../../utils'
// Components
import Form from '../../components/Form'
import Input from '../../components/Input'
import Anchor from '../../components/Anchor'

function SignIn() {
  const { setSucMsg, setErrMsg } = useMessage()
  const navigate = useNavigate()

  const onSubmit = async formData => {
    try {
      const { username, password } = formData
      const { data } = await axiosPublic.post('/api/auth/sign-in/pwd', { username, password })
      devLog(data)
      setSucMsg('Sign in successfully.')
      navigate('/')
    } catch (error) {
      devErr(error?.response?.data?.message || 'Unknown error')
      setErrMsg('Sign in failed.')
    }
  }

  return (
    <main className={S.main}>
      <div className={S.card}>
        <h2 className={S.cardTitle}>Sign In</h2>
        <Form schema={signInSchema} onSubmit={onSubmit}>
          {/* Username */}
          <Input style={S.input} name="username" placeholder="Please enter your username" maxLength={16} />

          {/* Password */}
          <Input style={S.input} type="password" name="password" placeholder="Please enter your password" maxLength={16} />

          {/* Reset Password */}
          <div className={S.reset}>
            <span className={S.text}>Forgot password?</span>
            <div className={S.linkContainer}>
              <Anchor style={S.link} int="/reset">
                Reset
              </Anchor>
            </div>
          </div>

          {/* Submit */}
          <button className={S.submit}>Sign In</button>

          {/* Switch */}
          <div className={S.switch}>
            <span className={S.text}>New to Uniclubs?</span>
            <div className={S.linkContainer}>
              <Anchor style={S.link} int="/sign-up">
                Sign Up
              </Anchor>
            </div>
          </div>
        </Form>
      </div>
    </main>
  )
}

export default SignIn
