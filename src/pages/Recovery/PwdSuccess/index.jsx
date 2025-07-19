// CSS Module
import S from './style.module.css'
// Components
import Card from '../../../components/Card'
import Icon from '../../../components/Icon'

function PwdSuccess() {
  return (
    <Card prevPath="/sign-in">
      <Icon style={S.check} icon="faCircleCheck" />
      <h2 className={S.title}>Password Updated</h2>
      <p className={S.message}>Your password has been updated successfully. You can now sign in with your new password.</p>
    </Card>
  )
}

export default PwdSuccess
