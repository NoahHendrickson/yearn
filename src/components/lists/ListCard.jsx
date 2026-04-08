import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './ListCard.module.css'

export function ListCard({ list, showOwner = false }) {
  return (
    <Link to={`/lists/${list.id}`} className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>{list.title}</h3>
        {list.is_public && <span className={styles.badge}>Public</span>}
      </div>
      {list.description && <p className={styles.desc}>{list.description}</p>}
      {showOwner && list.profiles && (
        <p className={styles.owner}>by {list.profiles.display_name || list.profiles.username}</p>
      )}
    </Link>
  )
}

ListCard.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    is_public: PropTypes.bool,
    profiles: PropTypes.shape({
      username: PropTypes.string,
      display_name: PropTypes.string,
    }),
  }).isRequired,
  showOwner: PropTypes.bool,
}
