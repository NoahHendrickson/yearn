import { useAuthStore } from '../stores/authStore'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function scrapeUrl(url) {
  const session = useAuthStore.getState().session
  const token = session?.access_token || SUPABASE_ANON_KEY

  const res = await fetch(`${SUPABASE_URL}/functions/v1/scrape-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) throw new Error(`Scrape failed: ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)

  return {
    name: data.name || '',
    imageUrl: data.imageUrl || '',
    description: data.description || '',
    size: data.size || '',
    color: data.color || '',
  }
}
