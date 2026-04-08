import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useListStore } from '../stores/listStore'
import { useGroupStore } from '../stores/groupStore'
import { usePeopleGroupStore } from '../stores/peopleGroupStore'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGrid } from '../components/lists/ListGrid'
import { ListForm } from '../components/lists/ListForm'
import { ListGroupCard } from '../components/groups/ListGroupCard'
import { ListGroupForm } from '../components/groups/ListGroupForm'
import { PeopleGroupCard } from '../components/people/PeopleGroupCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import styles from './DashboardPage.module.css'

const TABS = ['My Lists', 'Shared with Me', 'List Groups', 'People Groups']

export function DashboardPage() {
  const { loading } = useRequireAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('My Lists')
  const [showNewList, setShowNewList] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [showNewPeopleGroup, setShowNewPeopleGroup] = useState(false)

  const { myLists, sharedLists, fetchMyLists, fetchSharedLists, createList } = useListStore()
  const { myGroups, fetchMyGroups, createGroup } = useGroupStore()
  const { myPeopleGroups, fetchMyPeopleGroups, createPeopleGroup } = usePeopleGroupStore()

  useEffect(() => {
    if (!loading) {
      fetchMyLists()
      fetchSharedLists()
      fetchMyGroups()
      fetchMyPeopleGroups()
    }
  }, [loading, fetchMyLists, fetchSharedLists, fetchMyGroups, fetchMyPeopleGroups])

  const handleCreateList = async (fields) => {
    const list = await createList(fields)
    setShowNewList(false)
    navigate(`/lists/${list.id}/edit`)
  }

  const handleCreateGroup = async (fields) => {
    const group = await createGroup(fields)
    setShowNewGroup(false)
    navigate(`/groups/${group.id}`)
  }

  const handleCreatePeopleGroup = async (fields) => {
    const group = await createPeopleGroup(fields)
    setShowNewPeopleGroup(false)
    navigate(`/people-groups/${group.id}`)
  }

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader
        title="Dashboard"
        action={
          tab === 'My Lists' ? <Button onClick={() => setShowNewList(true)}>+ New List</Button>
          : tab === 'List Groups' ? <Button onClick={() => setShowNewGroup(true)}>+ New Group</Button>
          : tab === 'People Groups' ? <Button onClick={() => setShowNewPeopleGroup(true)}>+ New Group</Button>
          : null
        }
      />

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.active : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'My Lists' && (
          myLists.length === 0
            ? <EmptyState title="No lists yet" description="Create your first wishlist to get started." action={<Button onClick={() => setShowNewList(true)}>Create a list</Button>} />
            : <ListGrid lists={myLists} />
        )}

        {tab === 'Shared with Me' && (
          sharedLists.length === 0
            ? <EmptyState title="Nothing shared with you yet" description="When someone shares a list with you, it'll appear here." />
            : <ListGrid lists={sharedLists} showOwner />
        )}

        {tab === 'List Groups' && (
          myGroups.length === 0
            ? <EmptyState title="No groups yet" description="Group multiple lists together for an occasion." action={<Button onClick={() => setShowNewGroup(true)}>Create a group</Button>} />
            : <div className={styles.grid}>
                {myGroups.map(g => <ListGroupCard key={g.id} group={g} />)}
              </div>
        )}

        {tab === 'People Groups' && (
          myPeopleGroups.length === 0
            ? <EmptyState title="No people groups yet" description="Follow a group of people to see all their lists in one place." action={<Button onClick={() => setShowNewPeopleGroup(true)}>Create a group</Button>} />
            : <div className={styles.grid}>
                {myPeopleGroups.map(g => <PeopleGroupCard key={g.id} group={g} />)}
              </div>
        )}
      </div>

      {showNewList && (
        <Modal title="New list" onClose={() => setShowNewList(false)}>
          <ListForm onSubmit={handleCreateList} onCancel={() => setShowNewList(false)} submitLabel="Create list" />
        </Modal>
      )}

      {showNewGroup && (
        <Modal title="New list group" onClose={() => setShowNewGroup(false)}>
          <ListGroupForm onSubmit={handleCreateGroup} onCancel={() => setShowNewGroup(false)} submitLabel="Create group" />
        </Modal>
      )}

      {showNewPeopleGroup && (
        <Modal title="New people group" onClose={() => setShowNewPeopleGroup(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              className={styles.titleInput}
              placeholder="Group name (e.g. My Family)"
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  await handleCreatePeopleGroup({ title: e.target.value.trim() })
                }
              }}
              autoFocus
            />
            <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', margin: 0 }}>Press Enter to create</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
