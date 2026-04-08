import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useGroupStore = create((set, get) => ({
  myGroups: [],
  currentGroup: null,
  currentGroupLists: [],
  loading: false,

  fetchMyGroups: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('list_groups')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    set({ myGroups: data, loading: false })
  },

  createGroup: async ({ title, description, is_public }) => {
    const { data, error } = await supabase
      .from('list_groups')
      .insert({ title, description, is_public })
      .select()
      .single()
    if (error) throw error
    set(state => ({ myGroups: [data, ...state.myGroups] }))
    return data
  },

  updateGroup: async (id, fields) => {
    const { data, error } = await supabase
      .from('list_groups')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set(state => ({
      myGroups: state.myGroups.map(g => g.id === id ? data : g),
      currentGroup: state.currentGroup?.id === id ? data : state.currentGroup,
    }))
    return data
  },

  deleteGroup: async (id) => {
    const { error } = await supabase.from('list_groups').delete().eq('id', id)
    if (error) throw error
    set(state => ({ myGroups: state.myGroups.filter(g => g.id !== id) }))
  },

  fetchGroup: async (id) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('list_groups')
      .select('*, profiles(username, display_name)')
      .eq('id', id)
      .single()
    if (error) throw error
    set({ currentGroup: data, loading: false })
    return data
  },

  fetchGroupLists: async (groupId) => {
    const { data, error } = await supabase
      .from('list_group_members')
      .select('position, lists(*)')
      .eq('group_id', groupId)
      .order('position')
    if (error) throw error
    const lists = data.map(r => r.lists).filter(Boolean)
    set({ currentGroupLists: lists })
    return lists
  },

  addListToGroup: async (groupId, listId) => {
    const count = get().currentGroupLists.length
    const { error } = await supabase
      .from('list_group_members')
      .insert({ group_id: groupId, list_id: listId, position: count })
    if (error) throw error
    await get().fetchGroupLists(groupId)
  },

  removeListFromGroup: async (groupId, listId) => {
    const { error } = await supabase
      .from('list_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('list_id', listId)
    if (error) throw error
    set(state => ({
      currentGroupLists: state.currentGroupLists.filter(l => l.id !== listId),
    }))
  },

  addGroupShare: async (groupId, username) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()
    if (profileError) throw new Error('User not found')
    const { error } = await supabase
      .from('list_group_shares')
      .insert({ group_id: groupId, shared_with: profile.id })
    if (error) throw error
  },

  fetchGroupShares: async (groupId) => {
    const { data, error } = await supabase
      .from('list_group_shares')
      .select('shared_with, profiles(username, display_name)')
      .eq('group_id', groupId)
    if (error) throw error
    return data
  },
}))
