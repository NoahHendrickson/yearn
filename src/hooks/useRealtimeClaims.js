import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useListStore } from '../stores/listStore'

export function useRealtimeClaims(listId) {
  const { currentItems, fetchClaims } = useListStore()

  useEffect(() => {
    if (!listId || currentItems.length === 0) return

    const channel = supabase
      .channel(`claims:${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claims' },
        () => {
          // Re-fetch claims whenever any change happens on this list's items
          fetchClaims(listId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [listId, currentItems.length, fetchClaims])
}
