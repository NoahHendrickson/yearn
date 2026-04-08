import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'
import styles from './TopNav.module.css'

export function TopNav() {
  const { session, profile, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <Link to={session ? '/dashboard' : '/'} className={styles.logo}>
        Wishlist
      </Link>
      <div className={styles.actions}>
        {session ? (
          <>
            <Link to="/dashboard" className={styles.navLink}>My Lists</Link>
            <Link to="/profile" className={styles.navLink}>
              {profile?.display_name || profile?.username || 'Profile'}
            </Link>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>Sign out</Button>
          </>
        ) : (
          <>
            <Link to="/auth" className={styles.navLink}>Sign in</Link>
            <Button size="sm" onClick={() => navigate('/auth?tab=signup')}>Get started</Button>
          </>
        )}
      </div>
    </nav>
  )
}
