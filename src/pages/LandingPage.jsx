import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import styles from './LandingPage.module.css'

export function LandingPage() {
  const { session, loading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && session) navigate('/dashboard')
  }, [loading, session, navigate])

  return (
    <div className={styles.hero}>
      <h1 className={styles.headline}>Your family&apos;s wishlist, <em>organized.</em></h1>
      <p className={styles.sub}>
        Create wishlists, share them with family and friends, and never buy the wrong gift again.
        Anyone can claim an item — and the recipient never finds out.
      </p>
      <div className={styles.ctas}>
        <Button size="lg" onClick={() => navigate('/auth?tab=signup')}>Get started — it&apos;s free</Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/auth')}>Sign in</Button>
      </div>
      <div className={styles.features}>
        <div className={styles.feature}>
          <strong>Wishlists</strong>
          <p>Add items with links and prices so people know exactly what to buy.</p>
        </div>
        <div className={styles.feature}>
          <strong>Gift claiming</strong>
          <p>Claim an item so no one doubles up — hidden from the list owner.</p>
        </div>
        <div className={styles.feature}>
          <strong>Groups</strong>
          <p>Organize lists by occasion, or follow a group of people all at once.</p>
        </div>
      </div>
    </div>
  )
}
