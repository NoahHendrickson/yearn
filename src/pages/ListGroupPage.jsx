import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useAuthStore } from '../stores/authStore'
import { useGroupStore } from '../stores/groupStore'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGrid } from '../components/lists/ListGrid'
import { AddListToGroupModal } from '../components/groups/AddListToGroupModal'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import styles from './ListGroupPage.module.css'

export function ListGroupPage() {
  const { id } = useParams()
  const { loading: authLoading } = useRequireAuth()
  const { profile } = useAuthStore()
  const { currentGroup, currentGroupLists, fetchGroup, fetchGroupLists, removeListFromGroup } = useGroupStore()
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      Promise.all([fetchGroup(id), fetchGroupLists(id)]).finally(() => setLoading(false))
    }
  }, [id, authLoading, fetchGroup, fetchGroupLists])

  if (loading || !currentGroup) return <Spinner />

  const isOwner = profile?.id === currentGroup.owner_id

  return (
    <div>
      <PageHeader
        title={currentGroup.title}
        subtitle={currentGroup.description}
        action={isOwner && <Button size="sm" onClick={() => setShowAdd(true)}>+ Add list</Button>}
      />

      {currentGroupLists.length === 0 ? (
        <EmptyState
          title="No lists in this group"
          description="Add wishlists to this group to organize them together."
          action={isOwner && <Button onClick={() => setShowAdd(true)}>Add a list</Button>}
        />
      ) : (
        <div>
          <ListGrid lists={currentGroupLists} showOwner />
          {isOwner && (
            <div className={styles.manageSection}>
              <p className={styles.manageTitle}>Manage lists</p>
              <ul className={styles.manageList}>
                {currentGroupLists.map(list => (
                  <li key={list.id} className={styles.manageItem}>
                    <span>{list.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeListFromGroup(id, list.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <AddListToGroupModal
          groupId={id}
          existingListIds={currentGroupLists.map(l => l.id)}
          onClose={() => { setShowAdd(false); fetchGroupLists(id) }}
        />
      )}
    </div>
  )
}
