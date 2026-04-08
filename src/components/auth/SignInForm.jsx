import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import styles from './AuthForm.module.css'

export function SignInForm() {
  const { signIn } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        id="signin-email"
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="signin-password"
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={loading} size="lg" className={styles.submit}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
