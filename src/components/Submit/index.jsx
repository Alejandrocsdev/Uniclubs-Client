// CSS Module
import S from './style.module.css'
// Components
import InlineLoader from '../../loaders/InlineLoader'

const Submit = ({ style, loaderSize, isSubmitting, children, ...props }) => {
  return (
    <button className={style || S.submit} disabled={isSubmitting} {...props}>
      {isSubmitting ? <InlineLoader size={loaderSize} /> : children}
    </button>
  )
}

export default Submit
