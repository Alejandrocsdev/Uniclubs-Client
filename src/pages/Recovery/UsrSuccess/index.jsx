// CSS Module
import S from './style.module.css'
// Components
import Card from '../../../components/Card'
import Icon from '../../../components/Icon'

function UsrSuccess() {
  return (
    <Card prevPath="/sign-in">
      <Icon style={S.emailCheck} icon="faEnvelopeCircleCheck" />
      <h2 className={S.title}>Username Sent</h2>
      <p className={S.message}>Your username has been sent to your email address. Please check your inbox.</p>
    </Card>
  )
}

export default UsrSuccess
