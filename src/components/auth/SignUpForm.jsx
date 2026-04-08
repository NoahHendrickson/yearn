import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import styles from './AuthForm.module.css'

export function SignUpForm() {
  const { signUp } = useAuthStore()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, username)
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
        id="signup-username"
        label="Username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
        placeholder="e.g. jane_doe"
        required
        autoComplete="username"
      />
      <Input
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="signup-password"
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        minLength={8}
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" disabled={loading} size="lg" className={styles.submit}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
