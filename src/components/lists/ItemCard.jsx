import PropTypes from 'prop-types'
import { PriceDisplay } from '../ui/PriceDisplay'
import { ClaimButton } from './ClaimButton'
import styles from './ItemCard.module.css'

export function ItemCard({ item, listOwnerId, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.main}>
        <div className={styles.info}>
          <span className={styles.name}>{item.name}</span>
          {item.description && <span className={styles.desc}>{item.description}</span>}
          <div className={styles.meta}>
            {item.price && <PriceDisplay price={item.price} />}
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                View item
              </a>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <ClaimButton item={item} listOwnerId={listOwnerId} />
          {onEdit && (
            <button className={styles.iconBtn} onClick={() => onEdit(item)} aria-label="Edit item">
              ✏️
            </button>
          )}
          {onDelete && (
            <button className={styles.iconBtn} onClick={() => onDelete(item.id)} aria-label="Delete item">
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  listOwnerId: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}
