// CSS Module
import S from './style.module.css';
// Components
import Card from '../Card';
import Icon from '../Icon';

function Error({ full }) {
  return (
    <div className={`${S.background} ${full ? S.full : ''}`}>
      <Card>
        <Icon style={S.xMark} icon="faCircleXmark" />
        <h2 className={S.title}>Something went wrong</h2>
        <p className={S.message}>
          We couldn't connect to the server. Please refresh the page or try
          again later.
        </p>
        <button className={S.button} onClick={() => window.location.reload()}>
          Try Again
        </button>
      </Card>
    </div>
  );
}

export default Error;
