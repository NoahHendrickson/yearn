import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useListStore = create((set, get) => ({
  myLists: [],
  sharedLists: [],
  currentList: null,
  currentItems: [],
  currentClaims: {},  // itemId -> { claimed_by, claimer_username }
  loading: false,

  fetchMyLists: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    set({ myLists: data, loading: false })
  },

  fetchSharedLists: async () => {
    // Lists shared with me (not owned by me)
    const { data, error } = await supabase
      .from('list_shares')
      .select('list_id, lists(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    set({ sharedLists: data.map(r => r.lists).filter(Boolean) })
  },

  createList: async ({ title, description, is_public }) => {
    const { data, error } = await supabase
      .from('lists')
      .insert({ title, description, is_public })
      .select()
      .single()
    if (error) throw error
    set(state => ({ myLists: [data, ...state.myLists] }))
    return data
  },

  updateList: async (id, fields) => {
    const { data, error } = await supabase
      .from('lists')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set(state => ({
      myLists: state.myLists.map(l => l.id === id ? data : l),
      currentList: state.currentList?.id === id ? data : state.currentList,
    }))
    return data
  },

  deleteList: async (id) => {
    const { error } = await supabase.from('lists').delete().eq('id', id)
    if (error) throw error
    set(state => ({ myLists: state.myLists.filter(l => l.id !== id) }))
  },

  fetchList: async (id) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('lists')
      .select('*, profiles(username, display_name)')
      .eq('id', id)
      .single()
    if (error) throw error
    set({ currentList: data, loading: false })
    return data
  },

  fetchItems: async (listId) => {
    const { data, error } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', listId)
      .order('position')
    if (error) throw error
    set({ currentItems: data })
    return data
  },

  fetchClaims: async (listId) => {
    const { data, error } = await supabase
      .from('claims')
      .select('item_id, claimed_by, profiles(username, display_name)')
      .in('item_id', get().currentItems.map(i => i.id))
    if (error) return  // RLS may block owner — silently skip
    const claimsMap = {}
    for (const c of data) {
      claimsMap[c.item_id] = {
        claimed_by: c.claimed_by,
        username: c.profiles?.username,
        display_name: c.profiles?.display_name,
      }
    }
    set({ currentClaims: claimsMap })
  },

  addItem: async ({ listId, name, description, url, price }) => {
    const items = get().currentItems
    const position = items.length
    const { data, error } = await supabase
      .from('list_items')
      .insert({ list_id: listId, name, description, url, price, position })
      .select()
      .single()
    if (error) throw error
    set(state => ({ currentItems: [...state.currentItems, data] }))
    return data
  },

  updateItem: async (id, fields) => {
    const { data, error } = await supabase
      .from('list_items')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set(state => ({
      currentItems: state.currentItems.map(i => i.id === id ? data : i),
    }))
    return data
  },

  deleteItem: async (id) => {
    const { error } = await supabase.from('list_items').delete().eq('id', id)
    if (error) throw error
    set(state => ({ currentItems: state.currentItems.filter(i => i.id !== id) }))
  },

  reorderItems: async (items) => {
    set({ currentItems: items })
    const updates = items.map((item, idx) => ({
      id: item.id,
      list_id: item.list_id,
      name: item.name,
      position: idx,
    }))
    const { error } = await supabase.from('list_items').upsert(updates)
    if (error) throw error
  },

  claimItem: async (itemId) => {
    const { data, error } = await supabase
      .from('claims')
      .insert({ item_id: itemId })
      .select('item_id, claimed_by, profiles(username, display_name)')
      .single()
    if (error) throw error
    set(state => ({
      currentClaims: {
        ...state.currentClaims,
        [itemId]: {
          claimed_by: data.claimed_by,
          username: data.profiles?.username,
          display_name: data.profiles?.display_name,
        },
      },
    }))
  },

  unclaimItem: async (itemId) => {
    const { error } = await supabase
      .from('claims')
      .delete()
      .eq('item_id', itemId)
    if (error) throw error
    set(state => {
      const claims = { ...state.currentClaims }
      delete claims[itemId]
      return { currentClaims: claims }
    })
  },

  setClaims: (claimsMap) => set({ currentClaims: claimsMap }),

  addListShare: async (listId, username) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()
    if (profileError) throw new Error('User not found')
    const { error } = await supabase
      .from('list_shares')
      .insert({ list_id: listId, shared_with: profile.id })
    if (error) throw error
  },

  removeListShare: async (listId, userId) => {
    const { error } = await supabase
      .from('list_shares')
      .delete()
      .eq('list_id', listId)
      .eq('shared_with', userId)
    if (error) throw error
  },

  fetchListShares: async (listId) => {
    const { data, error } = await supabase
      .from('list_shares')
      .select('shared_with, profiles(username, display_name)')
      .eq('list_id', listId)
    if (error) throw error
    return data
  },
}))
