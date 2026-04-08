import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './PeopleGroupCard.module.css'

export function PeopleGroupCard({ group }) {
  return (
    <Link to={`/people-groups/${group.id}`} className={styles.card}>
      <h3 className={styles.title}>{group.title}</h3>
    </Link>
  )
}

PeopleGroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
}
