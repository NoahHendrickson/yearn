import { useState } from 'react'
import * as Icons from '@untitledui/icons'

const allIcons = Object.entries(Icons)

export default {
  title: 'Foundation/Icons',
  parameters: {
    layout: 'padded',
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        component:
          'Untitled UI icon library (`@untitledui/icons`). 1,180+ icons. Click any icon to copy its component name.',
      },
    },
  },
}

export const Gallery = {
  name: 'Icon Gallery',
  render: () => {
    const [search, setSearch] = useState('')
    const [size, setSize] = useState(24)

    const filtered = search
      ? allIcons.filter(([name]) =>
          name.toLowerCase().includes(search.toLowerCase())
        )
      : allIcons

    return (
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={`Search ${allIcons.length} icons…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border border-border-primary bg-bg-primary text-text-primary text-sm placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
          <select
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="h-10 px-3 rounded-md border border-border-primary bg-bg-primary text-text-primary text-sm focus:outline-none"
          >
            {[16, 20, 24, 32].map(s => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>
          <span className="text-sm text-text-tertiary whitespace-nowrap">
            {filtered.length} icons
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-1">
          {filtered.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => navigator.clipboard?.writeText(name)}
              title={`Click to copy: ${name}`}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-colors"
            >
              <Icon size={size} color="currentColor" className="text-text-primary shrink-0" />
              <span className="text-xs text-text-tertiary font-mono leading-tight break-all text-center">
                {name}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-text-tertiary">
            No icons match &ldquo;{search}&rdquo;
          </p>
        )}
      </div>
    )
  },
}

// ─── Single icon demo ─────────────────────────────────────────────────────────

export const SingleIcon = {
  name: 'Single Icon',
  argTypes: {
    icon: {
      control: 'select',
      options: allIcons.map(([name]) => name),
      description: 'Icon component name',
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      description: 'Size in px',
    },
    color: {
      control: 'color',
      description: 'Stroke color',
    },
  },
  args: {
    icon: 'Heart',
    size: 24,
    color: 'currentColor',
  },
  render: ({ icon, size, color }) => {
    const Icon = Icons[icon]
    if (!Icon) return <p className="text-text-tertiary text-sm">Icon not found</p>
    return (
      <div className="flex flex-col items-center gap-3">
        <Icon size={size} color={color} />
        <code className="text-xs text-text-tertiary font-mono">{`import { ${icon} } from '@untitledui/icons'`}</code>
      </div>
    )
  },
}
