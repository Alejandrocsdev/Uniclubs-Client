// CSS Module
import S from './style.module.css'
// Libraries
import MoonLoader from 'react-spinners/MoonLoader'

// https://www.davidhu.io/react-spinners
// default: loading = true, size = 60, color = '#000000', speed = 1, override = {}
const InlineLoader = ({ loading, size, color, speed, override }) => {
  return (
    <div className={S.loader}>
      <MoonLoader
        loading={loading}
        size={size}
        color={color}
        speedMultiplier={speed}
        cssOverride={override}
      />
    </div>
  )
}

export default InlineLoader
