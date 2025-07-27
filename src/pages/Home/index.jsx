// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
// Custom Functions
import { api, axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import { useRedux } from '../../hooks'
// Components
import Card from '../../components/Card'
import Form from '../../components/Form'
import Input from '../../components/Input'
import Anchor from '../../components/Anchor'
import Submit from '../../components/Submit'
// Validations
// import { updatePwdSchema } from '../../validations'

function Home() {
  const [formExtra, setFormExtra] = useState(null)
  const { setSucMsg, setErrMsg } = useMessage()
  const { user } = useRedux()

  // Form extra methods
  const { isSubmitting } = formExtra || {}

  const onUpdatePwd = async formData => {
    await api(axiosPrivate.post('/api/auth/reset/password', formData), {
      onSuccess: () => {
        setSucMsg('Password updated successfully.')
      },
      onError: () => {
        setErrMsg('Password update failed.')
        reset()
      }
    })
  }
  return (
    <main className={S.main}>
      <Card>
        <Form
          extra={setFormExtra}
          // schema={updatePwdSchema}
          onSubmit={onUpdatePwd}
        >
          {/* Current Password */}
          <Input name="currentPassword" placeholder="Current password" maxLength={16} />

          {/* New Password */}
          <Input name="password" placeholder="New password" maxLength={16} />

          {/* Repeat Password */}
          <Input name="rePassword" placeholder="Repeat password" maxLength={16} />

          {/* Submit */}
          <Submit loaderSize={10} isSubmitting={isSubmitting}>
            Update
          </Submit>
        </Form>
      </Card>
      <Anchor style={S.link} int="/sign-in">
        Go to [Sign In] page
      </Anchor>
    </main>
  )
}

export default Home
