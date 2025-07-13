// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
// Components
import EmailAddon from './addons/EmailAddon'
import PasswordAddon from './addons/PasswordAddon'

function Input({ name, ...props }) {
  const [show, setShow] = useState(false)

  const isPassword = name === 'password' || name === 'rePassword'
  const isEmail = name === 'email'

  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  const onInput = event => {
    if (name === 'username' || name === 'email') {
      event.target.value = event.target.value.toLowerCase()
    }
  }

  return (
    <div className={S.inputContainer}>
      <input
        className={`${S.input} ${isEmail ? S.email : ''} ${error ? S.invalid : ''}`}
        type={isPassword ? (show ? 'text' : 'password') : props.type}
        onInput={onInput}
        {...register(name)}
        {...props}
      />

      {/* Input Error */}
      {error && <div className={S.inputError}>{error}</div>}

      {/* Password Add-On: Toggles visibility */}
      {isPassword && <PasswordAddon show={show} setShow={setShow} />}

      {/* Email Add-On: Sends OTP */}
      {isEmail && <EmailAddon />}
    </div>
  )
}

export default Input
