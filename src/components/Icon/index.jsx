// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {} from '@fortawesome/free-brands-svg-icons'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faEye, faEyeSlash, faCircleLeft, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons'

// Icon mapping
const iconMap = {
  faCircleCheck,
  faCircleXmark,
  faEye,
  faEyeSlash,
  faCircleLeft,
  faEnvelopeCircleCheck
}

function Icon({ style, icon, onClick }) {
  const selected = iconMap[icon]
  return <FontAwesomeIcon className={style} icon={selected} onClick={onClick} />
}

export default Icon
