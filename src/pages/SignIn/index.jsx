// CSS Module
import S from './style.module.css'
// Components
import Icon from '../../components/Icon'
import Anchor from '../../components/Anchor'

function SignIn() {
  return (
    <main className={S.main}>
      <h1 className={S.title}>Welcome to Venue Booking</h1>
      <div className={S.card}>
        <h2 className={S.cardTitle}>Sign In</h2>
        <form className={S.form}>
          {/* Username */}
          <div className={S.inputContainer}>
            <input className={S.input} type="text" name="username" placeholder="Enter your Username" />
            {/* Input Error */}
            <div className={S.inputError}>Wrong</div>
          </div>

          {/* Password */}
          <div className={S.inputContainer}>
            <input className={S.input} type="password" name="password" placeholder="Enter your Password" />
            {/* Input Error */}
            <div className={S.inputError}>Wrong</div>
          </div>

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

          {/* Form Error */}
          <div className={S.formError}>Error</div>
        </form>
      </div>
    </main>
  )
}

export default SignIn
