import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const usePeopleGroupStore = create((set) => ({
  myPeopleGroups: [],
  currentPeopleGroup: null,
  currentMembers: [],
  memberLists: {},  // memberId -> [lists]
  loading: false,

  fetchMyPeopleGroups: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('people_groups')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    set({ myPeopleGroups: data, loading: false })
  },

  createPeopleGroup: async ({ title }) => {
    const { data, error } = await supabase
      .from('people_groups')
      .insert({ title })
      .select()
      .single()
    if (error) throw error
    set(state => ({ myPeopleGroups: [data, ...state.myPeopleGroups] }))
    return data
  },

  deletePeopleGroup: async (id) => {
    const { error } = await supabase.from('people_groups').delete().eq('id', id)
    if (error) throw error
    set(state => ({ myPeopleGroups: state.myPeopleGroups.filter(g => g.id !== id) }))
  },

  fetchPeopleGroup: async (id) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('people_groups')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    set({ currentPeopleGroup: data, loading: false })
    return data
  },

  fetchMembers: async (groupId) => {
    const { data, error } = await supabase
      .from('people_group_members')
      .select('member_id, profiles(id, username, display_name, avatar_url)')
      .eq('group_id', groupId)
    if (error) throw error
    const members = data.map(r => r.profiles).filter(Boolean)
    set({ currentMembers: members })
    return members
  },

  fetchMemberLists: async (members) => {
    const memberLists = {}
    await Promise.all(members.map(async (member) => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('owner_id', member.id)
        .order('created_at', { ascending: false })
      if (!error) memberLists[member.id] = data
    }))
    set({ memberLists })
    return memberLists
  },

  addMember: async (groupId, username) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('username', username)
      .single()
    if (profileError) throw new Error('User not found')
    const { error } = await supabase
      .from('people_group_members')
      .insert({ group_id: groupId, member_id: profile.id })
    if (error) throw error
    set(state => ({ currentMembers: [...state.currentMembers, profile] }))
    return profile
  },

  removeMember: async (groupId, memberId) => {
    const { error } = await supabase
      .from('people_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('member_id', memberId)
    if (error) throw error
    set(state => ({ currentMembers: state.currentMembers.filter(m => m.id !== memberId) }))
  },
}))
