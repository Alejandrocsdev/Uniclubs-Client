// CSS Module
import S from './style.module.css'
// Custom Functions
import useRedux from '../../hooks/useRedux'

function Home() {
  const { user, token } = useRedux()
  return (
    <main className={S.main}>
      <div>This is Home page.</div>
      <div>Username: {user?.username}</div>
      <div>Email: {user?.email}</div>
      <div>Token:</div>
      <div>{token}</div>
    </main>
  )
}

export default Home
