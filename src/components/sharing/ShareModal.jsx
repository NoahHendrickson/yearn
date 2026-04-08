import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useListStore } from '../../stores/listStore'
import styles from './ShareModal.module.css'

export function ShareModal({ list, onClose }) {
  const { updateList, addListShare, removeListShare, fetchListShares } = useListStore()
  const [shares, setShares] = useState([])
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(list.is_public)

  useEffect(() => {
    fetchListShares(list.id).then(setShares)
  }, [list.id, fetchListShares])

  const handleTogglePublic = async () => {
    const next = !isPublic
    await updateList(list.id, { is_public: next })
    setIsPublic(next)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await addListShare(list.id, username.trim())
      setUsername('')
      const updated = await fetchListShares(list.id)
      setShares(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId) => {
    await removeListShare(list.id, userId)
    setShares(s => s.filter(s => s.shared_with !== userId))
  }

  const shareUrl = `${window.location.origin}/lists/${list.id}`

  return (
    <Modal title="Share list" onClose={onClose}>
      <div className={styles.section}>
        <label className={styles.toggleLabel}>
          <input type="checkbox" checked={isPublic} onChange={handleTogglePublic} />
          <span>
            <strong>Public link</strong>
            <span className={styles.toggleDesc}>Anyone with the link can view this list</span>
          </span>
        </label>
        {isPublic && (
          <div className={styles.linkRow}>
            <input className={styles.linkInput} readOnly value={shareUrl} />
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(shareUrl)}>
              Copy
            </Button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Share with specific people</p>
        <form className={styles.addRow} onSubmit={handleAdd}>
          <Input
            id="share-username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Button type="submit" size="sm" disabled={loading}>Add</Button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {shares.length > 0 && (
          <ul className={styles.shareList}>
            {shares.map(s => (
              <li key={s.shared_with} className={styles.shareItem}>
                <span>{s.profiles?.display_name || s.profiles?.username}</span>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(s.shared_with)}>Remove</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

ShareModal.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    is_public: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
