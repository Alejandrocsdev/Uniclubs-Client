// CSS Module
import S from './style.module.css'
// Libraries
import { useFormContext } from 'react-hook-form'

function Input({ name, type = 'text', placeholder }) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className={S.inputContainer}>
      <input
        className={S.input}
        {...register(name, { required: `${name} is required` })}
        type={type}
        placeholder={placeholder}
      />
      {error && <div className={S.inputError}>{error}</div>}
    </div>
  )
}

export default Input
