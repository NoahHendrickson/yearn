import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { cx } from '@/utils/cx'
import { Button } from '@/components/ui/Button'

// Deterministic color from a string
const TILE_COLORS = [
  'bg-orange-100 text-orange-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
]

function tileColor(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return TILE_COLORS[Math.abs(hash) % TILE_COLORS.length]
}

function daysLeftLabel(dueDate) {
  if (!dueDate) return null
  const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Due today'
  return `${days} day${days === 1 ? '' : 's'} left`
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ListCard({ list, isOwner = false, onDelete, onShare }) {
  const navigate = useNavigate()
  const owner = list.profiles
  const items = Array.isArray(list.list_items)
    ? [...list.list_items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : []
  const previewItems = items.slice(0, 4)
  const itemCount = items.length
  const daysLabel = daysLeftLabel(list.due_date)
  const ownerName = owner?.display_name || owner?.username || 'Unknown'

  return (
    <div className={cx(
      'relative flex flex-col gap-4 p-6 w-[300px]',
      'rounded-[32px] border border-white/[0.12] shadow-xs overflow-hidden',
    )}>
      {/* Glassmorphic white overlay */}
      <div className="absolute inset-0 bg-white/30 rounded-[32px] pointer-events-none" aria-hidden="true" />

      {/* Inner skeuomorphic border */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.08),inset_0px_-2px_0px_0px_rgba(0,0,0,0.04)]" aria-hidden="true" />

      {/* Content sits above overlays */}
      <div className="relative flex flex-col gap-4">

        {/* Row 1: Owner badge + days left */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-primary rounded-full py-1 pl-1.5 pr-3 shrink-0">
            <div className="w-4 h-4 rounded-full bg-brand-200 flex items-center justify-center text-[10px] font-semibold text-brand-700 shrink-0">
              {ownerName[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-secondary whitespace-nowrap">{ownerName}</span>
          </div>
          {daysLabel && (
            <span className="text-sm font-medium text-text-primary whitespace-nowrap ml-2">{daysLabel}</span>
          )}
        </div>

        <div className="h-px bg-border-primary" />

        {/* Row 2: Title + description */}
        <div className="flex flex-col gap-0.5 min-h-[4.5rem]">
          <p className="text-lg font-medium text-text-primary leading-snug line-clamp-1">{list.title}</p>
          {list.description && (
            <p className="text-sm text-text-secondary line-clamp-2 leading-snug">{list.description}</p>
          )}
        </div>

        <div className="h-px bg-border-primary" />

        {/* Row 3: Item preview strip */}
        {previewItems.length > 0 && (
          <div className="flex items-end pr-6">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className={cx(
                  'w-20 h-20 rounded-2xl border-4 border-white -mr-6 shrink-0',
                  'flex items-center justify-center',
                  tileColor(item.name),
                )}
              >
                <span className="text-2xl font-semibold">{(item.name || '?')[0].toUpperCase()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Item count */}
        <p className="text-sm font-medium text-text-primary">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>

        <div className="h-px bg-border-primary" />

        {/* Row 5: Actions */}
        <div className="flex items-center justify-end gap-2">
          {isOwner && onDelete && (
            <Button
              variant="secondary"
              size="sm"
              iconOnly
              leadingIcon={<TrashIcon />}
              onClick={() => onDelete(list.id)}
              aria-label="Delete list"
            />
          )}
          {onShare && (
            <Button
              variant="primary"
              size="sm"
              iconOnly
              leadingIcon={<ShareIcon />}
              onClick={() => onShare(list.id)}
              aria-label="Share list"
            />
          )}
          <Button
            variant="primary"
            size="sm"
            trailingIcon={<ArrowRightIcon />}
            onClick={() => navigate(`/lists/${list.id}`)}
          >
            Open list
          </Button>
        </div>

      </div>
    </div>
  )
}

ListCard.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    due_date: PropTypes.string,
    is_public: PropTypes.bool,
    profiles: PropTypes.shape({
      username: PropTypes.string,
      display_name: PropTypes.string,
    }),
    list_items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      position: PropTypes.number,
    })),
  }).isRequired,
  isOwner: PropTypes.bool,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
}
