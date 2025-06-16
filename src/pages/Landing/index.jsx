// CSS Module
import S from './style.module.css'
// Libraries
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
// Custom Functions
import { axiosPublic } from '../../../api'

function Landing() {
  const [response, setResponse] = useState(null)

  const handleSubmit = useCallback(async () => {
    try {
      const res = await axiosPublic.post('/api/user', { name: 'Alex' })
      setResponse(res.data)
      console.log('Response:', res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }, [])

  return (
    <main className={S.main}>
      <p className={S.text}>This is Landing page</p>
      <button className={S.button} onClick={handleSubmit}>
        Send POST to /api/user
      </button>
      <span>{`${response?.message}`}</span>
      <Link className={S.link} to="/home">
        Go to Home page
      </Link>
    </main>
  )
}

export default Landing
