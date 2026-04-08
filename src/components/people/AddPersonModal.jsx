import { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { usePeopleGroupStore } from '../../stores/peopleGroupStore'
import styles from './AddPersonModal.module.css'

export function AddPersonModal({ groupId, onClose }) {
  const { addMember } = usePeopleGroupStore()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await addMember(groupId, username.trim())
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Add a person" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="person-username"
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter their username"
          required
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Adding…' : 'Add person'}</Button>
        </div>
      </form>
    </Modal>
  )
}

AddPersonModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}
