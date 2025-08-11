// CSS Module
import S from './style.module.css';
// Components
import Icon from '../Icon';
import Anchor from '../Anchor';

function Card({ prevPath, title, children }) {
  return (
    <div className={S.card}>
      <div className={S.cardHeader}>
        <div className={S.iconContainer}>
          {prevPath && (
            <Anchor int={prevPath}>
              <Icon style={S.previous} icon={'faCircleLeft'} className="white" />
            </Anchor>
          )}
        </div>
        <div className={S.titleContainer}>
          {title && <h2 className={S.cardTitle}>{title}</h2>}
        </div>
      </div>
      <div className={S.cardContent}>
        {children}
      </div>
    </div>
  );
}

export default Card;
