import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function useRequireAuth() {
  const { session, loading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth')
    }
  }, [loading, session, navigate])

  return { session, loading }
}
