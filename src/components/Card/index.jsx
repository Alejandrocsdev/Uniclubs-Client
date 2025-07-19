// CSS Module
import S from './style.module.css'
// Components
import Icon from '../Icon'
import Anchor from '../Anchor'

function Card({ prevPath, title, children }) {
  return (
    <div className={S.background}>
      <div className={S.card}>
        {prevPath && (
          <Anchor int={prevPath}>
            <Icon style={S.previous} icon={'faCircleLeft'} />
          </Anchor>
        )}
        {title && <h2 className={S.cardTitle}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export default Card
