import { useEffect, useState } from 'react'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useItemStore } from '../stores/itemStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { cx } from '../utils/cx'
import { scrapeUrl } from '../utils/scrapeUrl'
import { Plus, Trash01, Edit02, Link01, Share03 } from '@untitledui/icons'

// ── Add card ─────────────────────────────────────────────────────────────────

function AddItemCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'relative flex items-center justify-center w-[300px] h-[414px]',
        'rounded-[32px] border border-white/[0.12] shadow-xs overflow-hidden',
        'group transition-opacity hover:opacity-90',
      )}
      aria-label="Add new item"
    >
      <div className="absolute inset-0 bg-white/30 pointer-events-none rounded-[32px]" />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.08),inset_0px_-2px_0px_0px_rgba(0,0,0,0.04)]" />
      {/* Nested squares */}
      <div className="relative p-8 rounded-[96px]">
        <div className="bg-[#f3f3f3] p-8 rounded-[64px]">
          <div className="bg-[#eaeaea] p-8 rounded-[32px]">
            <Button size="sm" leadingIcon={<Plus size={16} />}>
              New item
            </Button>
          </div>
        </div>
      </div>
    </button>
  )
}

// ── Item card ─────────────────────────────────────────────────────────────────

const STATUS_EMOJI = {
  'Yearning bad': '🤤',
  'Yearning a little': '😌',
}

function YearnItemCard({ item, onDelete, onEdit }) {
  const handleCopyLink = () => {
    if (item.url) navigator.clipboard.writeText(item.url)
  }
  const handleOpen = () => {
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={cx(
      'relative flex flex-col gap-4 p-6 w-[300px]',
      'rounded-[32px] border border-white/[0.12] shadow-xs overflow-hidden',
    )}>
      <div className="absolute inset-0 bg-white/30 pointer-events-none rounded-[32px]" />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.08),inset_0px_-2px_0px_0px_rgba(0,0,0,0.04)]" />

      <div className="relative flex flex-col gap-4">
        {/* Actions row — top */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" iconOnly leadingIcon={<Trash01 size={16} />} onClick={() => onDelete(item.id)} aria-label="Delete item" />
          <Button variant="secondary" size="sm" iconOnly leadingIcon={<Edit02 size={16} />} onClick={() => onEdit(item)} aria-label="Edit item" />
          <Button variant="secondary" size="sm" iconOnly leadingIcon={<Link01 size={16} />} onClick={handleCopyLink} aria-label="Copy link" />
          <Button variant="primary" size="sm" iconOnly leadingIcon={<Share03 size={16} />} onClick={handleOpen} aria-label="Open link" />
        </div>

        <div className="h-px bg-border-primary" />

        {/* Name + url */}
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-medium text-text-primary line-clamp-1">{item.name}</p>
          {item.url && (
            <p className="text-sm text-text-secondary line-clamp-2 leading-snug break-all">{item.url}</p>
          )}
        </div>

        {/* Image + size/color */}
        {item.image_url && (
          <div className="flex flex-col gap-1">
            <div className="w-full h-[134px] rounded-2xl overflow-hidden border border-border-primary shadow-xs bg-bg-tertiary">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            {(item.size || item.color) && (
              <div className="flex items-center justify-between text-sm font-medium text-text-tertiary">
                <span>{item.size}</span>
                <span>{item.color}</span>
              </div>
            )}
          </div>
        )}

        {!item.image_url && (item.size || item.color) && (
          <div className="flex items-center justify-between text-sm font-medium text-text-tertiary">
            <span>{item.size}</span>
            <span>{item.color}</span>
          </div>
        )}

        <div className="h-px bg-border-primary" />

        {/* Status badge */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-border-secondary bg-bg-secondary text-sm font-medium text-text-secondary uppercase tracking-wide">
            {STATUS_EMOJI[item.yearning_status] || '✨'} {item.yearning_status}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Add item modal ────────────────────────────────────────────────────────────

function AddItemModal({ onClose, onSave }) {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [yearnStatus, setYearnStatus] = useState('Yearning bad')
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [error, setError] = useState('')

  const handleUrlPaste = async (e) => {
    const pasted = e.clipboardData?.getData('text') || ''
    if (!pasted) return
    let parsed
    try { parsed = new URL(pasted) } catch { return }
    if (!parsed.protocol.startsWith('http')) return
    setScraping(true)
    try {
      const meta = await scrapeUrl(pasted)
      if (meta.name) setName(prev => prev || meta.name)
      if (meta.imageUrl) setImageUrl(prev => prev || meta.imageUrl)
      if (meta.size) setSize(prev => prev || meta.size)
      if (meta.color) setColor(prev => prev || meta.color)
    } catch (err) {
      setError('Could not fetch link details — fill in manually.')
    } finally {
      setScraping(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Item name is required.'); return }
    setError('')
    setLoading(true)
    try {
      await onSave({ url, name, image_url: imageUrl, size, color, yearning_status: yearnStatus })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="What're you yearning for?" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="item-url"
          label="Link"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onPaste={handleUrlPaste}
          placeholder="Paste the URL here"
          hint={scraping ? 'Fetching details…' : 'Paste a link and we\'ll fill the rest'}
          leadingIcon={<Link01 size={16} />}
          size="sm"
        />
        <Input
          id="item-name"
          label="Item name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="What is it?"
          size="sm"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="item-status" className="text-sm font-medium text-text-secondary">
            How bad are you yearning?
          </label>
          <select
            id="item-status"
            value={yearnStatus}
            onChange={e => setYearnStatus(e.target.value)}
            className="h-9 px-3 rounded-md border border-border-primary bg-bg-primary text-sm text-text-primary shadow-xs outline-none focus:border-2 focus:border-border-brand"
          >
            <option value="Yearning bad">Yearning bad</option>
            <option value="Yearning a little">Yearning a little</option>
          </select>
        </div>
        <Input
          id="item-image"
          label="Image URL"
          type="url"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="Paste an image URL (optional)"
          size="sm"
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="item-size"
              label="Size"
              value={size}
              onChange={e => setSize(e.target.value)}
              placeholder="e.g. Medium"
              size="sm"
            />
          </div>
          <div className="flex-1">
            <Input
              id="item-color"
              label="Color"
              value={color}
              onChange={e => setColor(e.target.value)}
              placeholder="e.g. Heather gray"
              size="sm"
            />
          </div>
        </div>
        {error && <p className="text-sm text-fg-error-primary">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={loading} className="flex-1">Save item</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Edit item modal ───────────────────────────────────────────────────────────

function EditItemModal({ item, onClose, onSave }) {
  const [url, setUrl] = useState(item.url || '')
  const [name, setName] = useState(item.name || '')
  const [imageUrl, setImageUrl] = useState(item.image_url || '')
  const [size, setSize] = useState(item.size || '')
  const [color, setColor] = useState(item.color || '')
  const [yearnStatus, setYearnStatus] = useState(item.yearning_status || 'Yearning bad')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Item name is required.'); return }
    setError('')
    setLoading(true)
    try {
      await onSave(item.id, { url, name, image_url: imageUrl, size, color, yearning_status: yearnStatus })
      onClose()
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Edit item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input id="edit-url" label="Link" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste the URL here" leadingIcon={<Link01 size={16} />} size="sm" />
        <Input id="edit-name" label="Item name" required value={name} onChange={e => setName(e.target.value)} placeholder="What is it?" size="sm" />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-status" className="text-sm font-medium text-text-secondary">How bad are you yearning?</label>
          <select id="edit-status" value={yearnStatus} onChange={e => setYearnStatus(e.target.value)} className="h-9 px-3 rounded-md border border-border-primary bg-bg-primary text-sm text-text-primary shadow-xs outline-none focus:border-2 focus:border-border-brand">
            <option value="Yearning bad">Yearning bad</option>
            <option value="Yearning a little">Yearning a little</option>
          </select>
        </div>
        <Input id="edit-image" label="Image URL" type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Paste an image URL (optional)" size="sm" />
        <div className="flex gap-4">
          <div className="flex-1"><Input id="edit-size" label="Size" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. Medium" size="sm" /></div>
          <div className="flex-1"><Input id="edit-color" label="Color" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. Heather gray" size="sm" /></div>
        </div>
        {error && <p className="text-sm text-fg-error-primary">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" loading={loading} className="flex-1">Save changes</Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function YearnPage() {
  const { loading: authLoading } = useRequireAuth()
  const { items, loading, fetchItems, addItem, updateItem, deleteItem } = useItemStore()
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    if (!authLoading) fetchItems().catch(console.error)
  }, [authLoading, fetchItems])

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner />
    </div>
  )

  return (
    <div className="px-8 py-9">
      <h1 className="text-[30px] font-normal leading-[38px] text-text-primary mb-8">
        What I&apos;m yearning for
      </h1>

      <div className="flex flex-wrap gap-4">
        <AddItemCard onClick={() => setShowModal(true)} />
        {items.map(item => (
          <YearnItemCard
            key={item.id}
            item={item}
            onDelete={deleteItem}
            onEdit={setEditItem}
          />
        ))}
      </div>

      {showModal && (
        <AddItemModal onClose={() => setShowModal(false)} onSave={addItem} />
      )}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} onSave={updateItem} />
      )}
    </div>
  )
}
