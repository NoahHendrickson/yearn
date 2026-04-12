import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'

export const useItemStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      set({ items: data, loading: false })
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  addItem: async ({ name, description, url, image_url, size, color, yearning_status }) => {
    const user = useAuthStore.getState().session?.user
    if (!user) throw new Error('Not authenticated')
    const position = get().items.length
    const tempId = `opt-${Date.now()}`

    // Optimistic insert — show the item immediately so the modal can close
    set(state => ({
      items: [{
        id: tempId,
        owner_id: user.id,
        name,
        description: description ?? null,
        url: url ?? null,
        image_url: image_url ?? null,
        size: size ?? null,
        color: color ?? null,
        position,
        yearning_status,
      }, ...state.items],
    }))

    // Persist in background; roll back the optimistic item on failure
    ;(async () => {
      try {
        const { error } = await supabase
          .from('items')
          .insert({ owner_id: user.id, name, description, url, image_url, size, color, position, yearning_status })
        if (error) throw error
        const { data } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false })
        if (data) set({ items: data })
      } catch {
        set(state => ({ items: state.items.filter(i => i.id !== tempId) }))
      }
    })()
  },

  updateItem: async (id, fields) => {
    const { data, error } = await supabase
      .from('items')
      .update(fields)
      .eq('id', id)
      .select()
    if (error) throw error
    if (data?.length) set(state => ({ items: state.items.map(i => i.id === id ? data[0] : i) }))
  },

  deleteItem: async (id) => {
    set(state => ({ items: state.items.filter(i => i.id !== id) }))
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) {
      await get().fetchItems()
      throw error
    }
  },

  uploadItemImage: async (file) => {
    const user = useAuthStore.getState().session?.user
    if (!user) throw new Error('Not authenticated')
    const ext = file.name?.split('.').pop() || 'png'
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('item-images').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('item-images').getPublicUrl(path)
    return data.publicUrl
  },
}))
