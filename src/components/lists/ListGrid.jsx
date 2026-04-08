import PropTypes from 'prop-types'
import { ListCard } from './ListCard'
import styles from './ListGrid.module.css'

export function ListGrid({ lists, showOwner }) {
  return (
    <div className={styles.grid}>
      {lists.map(list => (
        <ListCard key={list.id} list={list} showOwner={showOwner} />
      ))}
    </div>
  )
}

ListGrid.propTypes = {
  lists: PropTypes.array.isRequired,
  showOwner: PropTypes.bool,
}
