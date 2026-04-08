import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { SignInForm } from '../components/auth/SignInForm'
import { SignUpForm } from '../components/auth/SignUpForm'
import styles from './AuthPage.module.css'

export function AuthPage() {
  const { session, loading } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'signin')

  useEffect(() => {
    if (!loading && session) navigate('/dashboard')
  }, [loading, session, navigate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Wishlist</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'signin' ? styles.active : ''}`}
            onClick={() => setTab('signin')}
          >
            Sign in
          </button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`}
            onClick={() => setTab('signup')}
          >
            Create account
          </button>
        </div>
        {tab === 'signin' ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  )
}
