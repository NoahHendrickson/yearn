import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { cx } from '@/utils/cx'

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 9l4-4 4 4" />
      <path d="M16 15l-4 4-4-4" />
    </svg>
  )
}

export function TopNav() {
  const { session, profile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  const displayName = profile?.display_name || profile?.username || 'Account'
  const initial = displayName[0].toUpperCase()

  return (
    <nav className="flex items-center justify-between px-6 py-4 shrink-0 w-full">
      {/* Wordmark */}
      <Link
        to={session ? '/dashboard' : '/'}
        className="text-2xl font-semibold text-fg-brand-primary tracking-tight"
      >
        Yearn
      </Link>

      {/* Right side */}
      {session ? (
        <div className="relative" ref={menuRef}>
          {/* Account card trigger */}
          <button
            onClick={() => setOpen(v => !v)}
            className={cx(
              'flex items-center gap-1.5 pl-2 pr-1 py-2 rounded-lg',
              'border border-border-secondary bg-bg-primary',
              'hover:bg-bg-secondary transition-colors',
            )}
          >
            {/* Avatar */}
            <div className="w-5 h-5 rounded-full bg-brand-200 flex items-center justify-center text-[10px] font-semibold text-brand-700 shrink-0">
              {initial}
            </div>
            <span className="text-sm font-semibold text-text-primary">{displayName}</span>
            {/* Chevron button */}
            <span className={cx(
              'ml-1 p-1.5 rounded-md border border-border-primary shadow-xs bg-bg-primary text-fg-tertiary',
            )}>
              <ChevronIcon />
            </span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-bg-primary border border-border-primary rounded-lg shadow-md z-50 overflow-hidden">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
              >
                Profile
              </Link>
              <div className="h-px bg-border-primary" />
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2.5 text-sm text-fg-error-primary hover:bg-bg-secondary transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Sign in
          </Link>
          <button
            onClick={() => navigate('/auth?tab=signup')}
            className="text-sm font-semibold text-text-white bg-bg-brand-solid px-3 py-1.5 rounded-md"
          >
            Get started
          </button>
        </div>
      )}
    </nav>
  )
}
