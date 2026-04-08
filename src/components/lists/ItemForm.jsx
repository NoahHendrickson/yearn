import { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import styles from './ItemForm.module.css'

export function ItemForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Add item' }) {
  const [name, setName] = useState(initial.name || '')
  const [description, setDescription] = useState(initial.description || '')
  const [url, setUrl] = useState(initial.url || '')
  const [price, setPrice] = useState(initial.price != null ? String(initial.price) : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        name,
        description: description || null,
        url: url || null,
        price: price ? parseFloat(price) : null,
      })
      if (!initial.id) {
        setName('')
        setDescription('')
        setUrl('')
        setPrice('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        id="item-name"
        label="Item name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. AirPods Pro"
        required
      />
      <Input
        id="item-desc"
        label="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Any details, color, size, etc."
      />
      <div className={styles.row}>
        <Input
          id="item-url"
          label="Link (optional)"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://..."
        />
        <Input
          id="item-price"
          label="Price (optional)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="0.00"
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : submitLabel}</Button>
      </div>
    </form>
  )
}

ItemForm.propTypes = {
  initial: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
}
