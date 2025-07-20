// CSS Module
import S from './style.module.css'
// Libraries
import { useEffect } from 'react'
// Custom Functions
import useRedux from '../../hooks/useRedux'

function Home() {
  const { user } = useRedux()

useEffect(() => {
  fetch('/api/edge')
    .then(res => res.json())
    .then(console.log)
    .catch(console.error)
}, [])
  return (
    <main className={S.main}>
      <div>This is Home page.</div>
      <div>Username: {user?.username}</div>
      <div>Email: {user?.email}</div>
    </main>
  )
}

export default Home
