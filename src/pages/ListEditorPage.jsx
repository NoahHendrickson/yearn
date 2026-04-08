import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useListStore } from '../stores/listStore'
import { useAuthStore } from '../stores/authStore'
import { PageHeader } from '../components/layout/PageHeader'
import { ItemCard } from '../components/lists/ItemCard'
import { ItemForm } from '../components/lists/ItemForm'
import { ListForm } from '../components/lists/ListForm'
import { ShareModal } from '../components/sharing/ShareModal'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import styles from './ListEditorPage.module.css'

export function ListEditorPage() {
  useRequireAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const { currentList, currentItems, fetchList, fetchItems, addItem, updateItem, deleteItem, reorderItems, deleteList, loading } = useListStore()

  const [editingItem, setEditingItem] = useState(null)
  const [showListForm, setShowListForm] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [dragOver, setDragOver] = useState(null)
  const [dragItem, setDragItem] = useState(null)

  useEffect(() => {
    fetchList(id).then(() => fetchItems(id))
  }, [id, fetchList, fetchItems])

  // Redirect if not the owner
  useEffect(() => {
    if (currentList && profile && currentList.owner_id !== profile.id) {
      navigate(`/lists/${id}`)
    }
  }, [currentList, profile, id, navigate])

  const handleDeleteList = async () => {
    if (!confirm('Delete this list? This cannot be undone.')) return
    await deleteList(id)
    navigate('/dashboard')
  }

  // Drag-to-reorder
  const handleDragStart = (item) => setDragItem(item)
  const handleDragOver = (e, item) => { e.preventDefault(); setDragOver(item.id) }
  const handleDrop = async (targetItem) => {
    if (!dragItem || dragItem.id === targetItem.id) return
    const items = [...currentItems]
    const fromIdx = items.findIndex(i => i.id === dragItem.id)
    const toIdx = items.findIndex(i => i.id === targetItem.id)
    items.splice(fromIdx, 1)
    items.splice(toIdx, 0, dragItem)
    await reorderItems(items)
    setDragItem(null)
    setDragOver(null)
  }

  if (loading || !currentList) return <Spinner />

  return (
    <div>
      <PageHeader
        title={currentList.title}
        subtitle={currentList.description}
        action={
          <div className={styles.headerActions}>
            <Button variant="secondary" size="sm" onClick={() => setShowListForm(true)}>Edit details</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowShare(true)}>Share</Button>
            <Button variant="danger" size="sm" onClick={handleDeleteList}>Delete</Button>
          </div>
        }
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Add item</h2>
        <ItemForm
          onSubmit={({ name, description, url, price }) =>
            addItem({ listId: id, name, description, url, price })
          }
        />
      </section>

      {currentItems.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Items <span className={styles.count}>{currentItems.length}</span></h2>
          <div className={styles.items}>
            {currentItems.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDrop={() => handleDrop(item)}
                className={`${styles.draggable} ${dragOver === item.id ? styles.dragOver : ''}`}
              >
                <span className={styles.handle} title="Drag to reorder">⠿</span>
                <ItemCard
                  item={item}
                  listOwnerId={currentList.owner_id}
                  onEdit={setEditingItem}
                  onDelete={(itemId) => deleteItem(itemId)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {editingItem && (
        <Modal title="Edit item" onClose={() => setEditingItem(null)}>
          <ItemForm
            initial={editingItem}
            submitLabel="Save changes"
            onSubmit={async (fields) => {
              await updateItem(editingItem.id, fields)
              setEditingItem(null)
            }}
            onCancel={() => setEditingItem(null)}
          />
        </Modal>
      )}

      {showListForm && (
        <Modal title="Edit list details" onClose={() => setShowListForm(false)}>
          <ListForm
            initial={currentList}
            submitLabel="Save changes"
            onSubmit={async (fields) => {
              const { updateList } = useListStore.getState()
              await updateList(id, fields)
              setShowListForm(false)
            }}
            onCancel={() => setShowListForm(false)}
          />
        </Modal>
      )}

      {showShare && <ShareModal list={currentList} onClose={() => setShowShare(false)} />}
    </div>
  )
}
