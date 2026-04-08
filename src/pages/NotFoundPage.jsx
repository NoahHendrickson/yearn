import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.msg}>This page doesn&apos;t exist.</p>
      <Link to="/" className={styles.link}>Go home</Link>
    </div>
  )
}
