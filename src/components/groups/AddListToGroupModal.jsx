import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useListStore } from '../../stores/listStore'
import { useGroupStore } from '../../stores/groupStore'
import styles from './AddListToGroupModal.module.css'

export function AddListToGroupModal({ groupId, existingListIds, onClose }) {
  const { myLists, fetchMyLists } = useListStore()
  const { addListToGroup } = useGroupStore()
  const [loading, setLoading] = useState(null)

  useEffect(() => { fetchMyLists() }, [fetchMyLists])

  const available = myLists.filter(l => !existingListIds.includes(l.id))

  const handleAdd = async (listId) => {
    setLoading(listId)
    try {
      await addListToGroup(groupId, listId)
      onClose()
    } finally {
      setLoading(null)
    }
  }

  return (
    <Modal title="Add a list to this group" onClose={onClose}>
      {available.length === 0 ? (
        <p className={styles.empty}>All your lists are already in this group.</p>
      ) : (
        <ul className={styles.list}>
          {available.map(list => (
            <li key={list.id} className={styles.item}>
              <span>{list.title}</span>
              <Button size="sm" onClick={() => handleAdd(list.id)} disabled={loading === list.id}>
                {loading === list.id ? 'Adding…' : 'Add'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

AddListToGroupModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  existingListIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
}
