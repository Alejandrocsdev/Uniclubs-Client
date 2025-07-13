// Components
import InlineLoader from '../../loaders/InlineLoader'

const Submit = ({ style, size, isSubmitting, children, ...props }) => {
  return (
    <button className={style} disabled={isSubmitting} {...props}>
      {isSubmitting ? <InlineLoader size={size} /> : children}
    </button>
  )
}

export default Submit
