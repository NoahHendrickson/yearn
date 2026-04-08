import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useListStore } from '../stores/listStore'
import { useRealtimeClaims } from '../hooks/useRealtimeClaims'
import { PageHeader } from '../components/layout/PageHeader'
import { ItemCard } from '../components/lists/ItemCard'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import styles from './ListViewPage.module.css'

export function ListViewPage() {
  const { id } = useParams()
  const { profile } = useAuthStore()
  const { currentList, currentItems, fetchList, fetchItems, fetchClaims, loading } = useListStore()

  useEffect(() => {
    fetchList(id).then(() => {
      fetchItems(id).then(() => fetchClaims(id))
    })
  }, [id, fetchList, fetchItems, fetchClaims])

  useRealtimeClaims(id)

  if (loading || !currentList) return <Spinner />

  const isOwner = profile?.id === currentList.owner_id
  const ownerName = currentList.profiles?.display_name || currentList.profiles?.username

  return (
    <div>
      <PageHeader
        title={currentList.title}
        subtitle={ownerName ? `by ${ownerName}` : undefined}
        action={isOwner && (
          <Link to={`/lists/${id}/edit`}>
            <Button variant="secondary" size="sm">Edit list</Button>
          </Link>
        )}
      />
      {currentList.description && <p className={styles.desc}>{currentList.description}</p>}

      {currentItems.length === 0 ? (
        <EmptyState
          title="No items yet"
          description={isOwner ? 'Add items to your list so people know what you want.' : 'This list has no items yet.'}
          action={isOwner && <Link to={`/lists/${id}/edit`}><Button>Add items</Button></Link>}
        />
      ) : (
        <div className={styles.items}>
          {currentItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              listOwnerId={currentList.owner_id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
