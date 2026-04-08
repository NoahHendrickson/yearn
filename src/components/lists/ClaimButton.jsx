import { useState } from 'react'
import PropTypes from 'prop-types'
import { useAuthStore } from '../../stores/authStore'
import { useListStore } from '../../stores/listStore'
import { Button } from '../ui/Button'

export function ClaimButton({ item, listOwnerId }) {
  const { profile } = useAuthStore()
  const { currentClaims, claimItem, unclaimItem } = useListStore()
  const [loading, setLoading] = useState(false)

  // Never show to the list owner — the surprise is for them
  if (!profile || profile.id === listOwnerId) return null

  const claim = currentClaims[item.id]
  const isMine = claim?.claimed_by === profile.id

  const handleClaim = async () => {
    setLoading(true)
    try {
      if (isMine) {
        await unclaimItem(item.id)
      } else {
        await claimItem(item.id)
      }
    } finally {
      setLoading(false)
    }
  }

  if (claim && !isMine) {
    return (
      <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
        Claimed by {claim.display_name || claim.username}
      </span>
    )
  }

  return (
    <Button
      variant={isMine ? 'secondary' : 'primary'}
      size="sm"
      onClick={handleClaim}
      disabled={loading}
    >
      {isMine ? 'Unclaim' : 'Claim'}
    </Button>
  )
}

ClaimButton.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  listOwnerId: PropTypes.string.isRequired,
}
