// CSS Module
import S from './style.module.css'
// Libraries
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className={S.main}>
      <p>This is Home page</p>
      <Link to="/">Go to Landing page</Link>
    </main>
  )
}

export default Home
