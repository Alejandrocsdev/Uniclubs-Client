// CSS Module
import S from './style.module.css'
// Libraries
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Custom Functions
import { api, axiosPrivate } from '../../api'
import { useMessage } from '../../contexts/MessageContext'
import { useRedux, useUpdateEffect } from '../../hooks'
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
  const navigate = useNavigate()
  const { clearAuth } = useRedux()

  // Form extra methods
  const { reset, isSubmitting } = formExtra || {}
  useUpdateEffect(() => reset(), [])

  const onUpdatePwd = async formData => {
    await api(axiosPrivate.patch('/api/user/password', formData), {
      onSuccess: () => {
        setSucMsg('Password updated successfully.')
      },
      onError: () => {
        setErrMsg('Password update failed.')
      },
      onFinally: () => {
        reset()
      }
    })
  }

  const onSignOut = async () => {
    await api(axiosPrivate.post('/api/auth/sign-out'), {
      onSuccess: () => {
        setSucMsg('Signed out successfully.')
        navigate('/sign-in')
      },
      onError: () => {
        setErrMsg('Sign out failed.')
        clearAuth()
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
          <Input name="password" placeholder="Current password" maxLength={16} />

          {/* New Password */}
          <Input name="newPassword" placeholder="New password" maxLength={16} />

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
      <button className={S.link} onClick={onSignOut}>
        Sign Out
      </button>
    </main>
  )
}

export default Home
