// CSS Module
import S from './style.module.css'
// Libraries
import HashLoader from 'react-spinners/HashLoader'

// https://www.davidhu.io/react-spinners
// default: loading = true, size = 50, color = '#000000', speed = 1, override = {}
const ScreenLoader = ({ loading, size = 80, color = '#ffffff', speed, override }) => {
  return (
    <div className={S.loader}>
      <HashLoader
        loading={loading}
        size={size}
        color={color}
        speedMultiplier={speed}
        cssOverride={override}
      />
    </div>
  )
}

export default ScreenLoader
