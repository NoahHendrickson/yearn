import { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import styles from './ListGroupForm.module.css'

export function ListGroupForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [isPublic, setIsPublic] = useState(initial.is_public ?? false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ title, description, is_public: isPublic })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input id="group-title" label="Group name" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Family Christmas 2026" />
      <Input id="group-desc" label="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
      <label className={styles.checkLabel}>
        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        Make this group public
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}

ListGroupForm.propTypes = {
  initial: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
}
