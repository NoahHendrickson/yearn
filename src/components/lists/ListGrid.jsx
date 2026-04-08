import PropTypes from 'prop-types'
import { ListCard } from './ListCard'

export function ListGrid({ lists, isOwner = false, onDelete, onShare }) {
  return (
    <div className="flex flex-wrap gap-4">
      {lists.map(list => (
        <ListCard
          key={list.id}
          list={list}
          isOwner={isOwner}
          onDelete={onDelete}
          onShare={onShare}
        />
      ))}
    </div>
  )
}

ListGrid.propTypes = {
  lists: PropTypes.array.isRequired,
  isOwner: PropTypes.bool,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
}
