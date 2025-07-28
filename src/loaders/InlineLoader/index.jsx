// CSS Module
import S from './style.module.css';
// Libraries
import BeatLoader from 'react-spinners/BeatLoader';

// https://www.davidhu.io/react-spinners
// default: loading = true, size = 15, margin = 2, color = '#000000', speed = 1, override = {}
const InlineLoader = ({ loading, size, margin, color, speed, override }) => {
  return (
    <div className={S.loader}>
      <BeatLoader
        loading={loading}
        size={size}
        margin={margin}
        color={color}
        speedMultiplier={speed}
        cssOverride={override}
      />
    </div>
  );
};

export default InlineLoader;
