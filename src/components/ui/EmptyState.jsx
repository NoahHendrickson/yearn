import PropTypes from 'prop-types'
import styles from './EmptyState.module.css'

export function EmptyState({ title, description, action }) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
      {action}
    </div>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
}
