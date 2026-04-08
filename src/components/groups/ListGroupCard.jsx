import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './ListGroupCard.module.css'

export function ListGroupCard({ group }) {
  return (
    <Link to={`/groups/${group.id}`} className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>{group.title}</h3>
        {group.is_public && <span className={styles.badge}>Public</span>}
      </div>
      {group.description && <p className={styles.desc}>{group.description}</p>}
    </Link>
  )
}

ListGroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    is_public: PropTypes.bool,
  }).isRequired,
}
