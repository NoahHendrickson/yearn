import { useState } from 'react'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import { PageHeader } from '../components/layout/PageHeader'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { loading } = useRequireAuth()
  const { profile, updateProfile } = useAuthStore()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (loading || !profile) return <Spinner />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      let avatar_url = profile.avatar_url
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `${profile.id}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = data.publicUrl
      }
      await updateProfile({ display_name: displayName, avatar_url })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profile" />
      <div className={styles.card}>
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt="Avatar" className={styles.avatar} />
        )}
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.username}>@{profile.username}</p>
          <Input
            id="display-name"
            label="Display name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
          <div>
            <label className={styles.fileLabel} htmlFor="avatar">Profile picture</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files[0])}
              className={styles.fileInput}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>Profile updated!</p>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </form>
      </div>
    </div>
  )
}
