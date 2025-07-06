// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
// Components
import Icon from '../Icon'

function Input({ name, ...props }) {
  const [show, setShow] = useState(false)
  const togglePassword = () => setShow(!show)
  const isPassword = name === 'password' || name === 'rePassword'

  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className={S.inputContainer}>
      <input
        className={`${S.input}${error ? ` ${S.invalid}` : ''}`}
        type={isPassword ? (show ? 'text' : 'password') : props.type}
        {...register(name)}
        {...props}
      />

      {/* Input Error */}
      {error && <div className={S.inputError}>{error}</div>}

      {/* Toggle Password Visibility */}
      {isPassword && <Icon style={S.eyeIcon} icon={show ? 'faEye' : 'faEyeSlash'} onClick={togglePassword} />}
    </div>
  )
}

export default Input
