// Libraries
import { Link } from 'react-router-dom'
// Utilities
import { devErr } from '../../../utils'

function Anchor({ int, ext, style, target, onClick, children }) {
  if (int && ext) devErr('❌ [Anchor]: "int" and "ext" only one is allowed.')

  // Internal Link
  if (int) {
    return (
      <Link to={int} className={style} target={target || '_self'} onClick={onClick}>
        {children}
      </Link>
    )
  }

  // External Link
  if (ext) {
    return (
      <a href={ext} className={style} target={target || '_blank'} onClick={onClick}>
        {children}
      </a>
    )
  }

  devErr('❌ [Anchor]: Neither "int" nor "ext" was provided.')

  return null
}

export default Anchor
