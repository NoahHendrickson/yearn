import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useAuthStore } from '../stores/authStore'
import { usePeopleGroupStore } from '../stores/peopleGroupStore'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGrid } from '../components/lists/ListGrid'
import { AddPersonModal } from '../components/people/AddPersonModal'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import styles from './PeopleGroupPage.module.css'

export function PeopleGroupPage() {
  const { id } = useParams()
  const { loading: authLoading } = useRequireAuth()
  const { profile } = useAuthStore()
  const { currentPeopleGroup, currentMembers, memberLists, fetchPeopleGroup, fetchMembers, fetchMemberLists, removeMember } = usePeopleGroupStore()
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      fetchPeopleGroup(id)
        .then(() => fetchMembers(id))
        .then((members) => fetchMemberLists(members))
        .finally(() => setLoading(false))
    }
  }, [id, authLoading, fetchPeopleGroup, fetchMembers, fetchMemberLists])

  if (loading || !currentPeopleGroup) return <Spinner />

  const isOwner = profile?.id === currentPeopleGroup.owner_id

  return (
    <div>
      <PageHeader
        title={currentPeopleGroup.title}
        action={isOwner && <Button size="sm" onClick={() => setShowAdd(true)}>+ Add person</Button>}
      />

      {currentMembers.length === 0 ? (
        <EmptyState
          title="No people in this group"
          description="Add people by username to see all their lists here."
          action={isOwner && <Button onClick={() => setShowAdd(true)}>Add a person</Button>}
        />
      ) : (
        <div className={styles.members}>
          {currentMembers.map(member => {
            const lists = memberLists[member.id] || []
            return (
              <div key={member.id} className={styles.memberSection}>
                <div className={styles.memberHeader}>
                  <h2 className={styles.memberName}>{member.display_name || member.username}</h2>
                  {isOwner && (
                    <Button variant="ghost" size="sm" onClick={() => removeMember(id, member.id)}>Remove</Button>
                  )}
                </div>
                {lists.length === 0 ? (
                  <p className={styles.noLists}>No public lists.</p>
                ) : (
                  <ListGrid lists={lists} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {showAdd && <AddPersonModal groupId={id} onClose={() => { setShowAdd(false); fetchMembers(id).then(fetchMemberLists) }} />}
    </div>
  )
}
