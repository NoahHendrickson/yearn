import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const profile = await get()._fetchProfile(session.user.id)
      set({ session, profile, loading: false })
    } else {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await get()._fetchProfile(session.user.id)
        set({ session, profile })
      } else {
        set({ session: null, profile: null })
      }
    })
  },

  _fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const profile = await get()._fetchProfile(data.session.user.id)
    set({ session: data.session, profile })
    return data
  },

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    })
    if (error) throw error
    if (data.session) {
      const profile = await get()._fetchProfile(data.session.user.id)
      set({ session: data.session, profile })
    }
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
  },

  updateProfile: async (fields) => {
    const { session } = get()
    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', session.user.id)
      .select()
      .single()
    if (error) throw error
    set({ profile: data })
    return data
  },
}))
