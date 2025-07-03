// Libraries
import { useForm, FormProvider } from 'react-hook-form'

function Form({ style, onSubmit, children }) {
  // Mode: onSubmit, onBlur, onChange, onTouched, all
  const methods = useForm({ mode: 'onChange' })

  return (
    <FormProvider {...methods}>
      <form className={style} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
