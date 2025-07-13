// CSS Module
import S from './style.module.css'
// Components
import Icon from '../../../Icon'

function PasswordAddon({ show, setShow }) {
  const togglePassword = () => setShow(!show)

  return <Icon style={S.eyeIcon} icon={show ? 'faEye' : 'faEyeSlash'} onClick={togglePassword} />
}

export default PasswordAddon
