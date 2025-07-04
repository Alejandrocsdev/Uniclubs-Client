// Libraries
import { useForm, FormProvider } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

function Form({ style, onSubmit, schema, children }) {
  // Mode: onSubmit, onBlur, onChange, onTouched, all
  const methods = useForm({
    mode: 'onChange',
    resolver: schema ? joiResolver(schema) : undefined
  })

  return (
    <FormProvider {...methods}>
      <form className={style} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
