import PropTypes from 'prop-types'
import styles from './Input.module.css'

export function Input({ label, error, id, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input id={id} className={`${styles.input} ${error ? styles.hasError : ''}`} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
}
