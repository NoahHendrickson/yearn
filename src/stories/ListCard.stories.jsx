import { MemoryRouter } from 'react-router-dom'
import { ListCard } from '@/components/lists/ListCard'

export default {
  title: 'Lists/ListCard',
  component: ListCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

const baseList = {
  id: '1',
  title: 'Bday 2026',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
  is_public: false,
  due_date: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  profiles: { username: 'hayley', display_name: "Hayley" },
  list_items: [
    { id: 'i1', name: 'Nike Air Max', position: 0 },
    { id: 'i2', name: 'Kindle Paperwhite', position: 1 },
    { id: 'i3', name: 'Lululemon Jacket', position: 2 },
    { id: 'i4', name: 'Vitamix Blender', position: 3 },
    { id: 'i5', name: 'AirPods Pro', position: 4 },
  ],
}

export const OwnerView = {
  name: "Owner's card (with delete)",
  args: {
    list: baseList,
    isOwner: true,
    onDelete: (id) => alert(`Delete ${id}`),
    onShare: (id) => alert(`Share ${id}`),
  },
}

export const GuestView = {
  name: "Guest's card (no delete)",
  args: {
    list: baseList,
    isOwner: false,
    onShare: (id) => alert(`Share ${id}`),
  },
}

export const NoDueDate = {
  name: 'No due date',
  args: {
    list: { ...baseList, due_date: null },
    isOwner: true,
    onDelete: () => {},
    onShare: () => {},
  },
}

export const NoItems = {
  name: 'Empty list (no items)',
  args: {
    list: { ...baseList, list_items: [] },
    isOwner: true,
    onDelete: () => {},
    onShare: () => {},
  },
}

export const NoDescription = {
  name: 'No description',
  args: {
    list: { ...baseList, description: null },
    isOwner: true,
    onDelete: () => {},
    onShare: () => {},
  },
}

export const DueSoon = {
  name: 'Due today',
  args: {
    list: {
      ...baseList,
      due_date: new Date().toISOString().split('T')[0],
    },
    isOwner: true,
    onDelete: () => {},
    onShare: () => {},
  },
}
