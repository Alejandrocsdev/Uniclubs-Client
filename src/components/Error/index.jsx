// CSS Module
import S from './style.module.css'
// Components
import Icon from '../Icon'

function Error() {
  return (
    <div className={S.error}>
      <div className={S.card}>
        <Icon style={S.xMark} icon='faCircleXmark' />
        <h2 className={S.title}>Something went wrong</h2>
        <p className={S.message}>We couldn't connect to the server.</p>
        <p className={S.message}>Please refresh the page or try again later.</p>
        <button className={S.button} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  )
}

export default Error
