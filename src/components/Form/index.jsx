// Libraries
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

function Form({ style, onSubmit, schema, extra, children }) {
  // Mode: onSubmit, onBlur, onChange, onTouched, all
  const methods = useForm({
    mode: 'onChange',
    resolver: schema ? joiResolver(schema) : undefined,
    shouldFocusError: false
  })

  useEffect(() => {
    extra({
      reset: methods.reset,
      setFocus: methods.setFocus
    })
  }, [])

  return (
    <FormProvider {...methods}>
      <form className={style} onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
