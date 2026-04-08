import { Button } from '@/components/ui/Button'

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component matching Untitled UI design system. Supports 5 hierarchies, 5 sizes, leading/trailing icons, icon-only, loading, and disabled states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'link-color', 'link-gray'],
      description: 'Visual hierarchy of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    children: { control: 'text' },
  },
}

// ─── Single stories ───────────────────────────────────────────────────────────

export const Primary = {
  args: { children: 'Button CTA', variant: 'primary', size: 'md' },
}

export const Secondary = {
  args: { children: 'Button CTA', variant: 'secondary', size: 'md' },
}

export const Tertiary = {
  args: { children: 'Button CTA', variant: 'tertiary', size: 'md' },
}

export const Destructive = {
  args: { children: 'Delete', variant: 'destructive', size: 'md' },
}

export const LinkColor = {
  args: { children: 'Learn more', variant: 'link-color', size: 'md' },
}

export const LinkGray = {
  args: { children: 'Learn more', variant: 'link-gray', size: 'md' },
}

export const Disabled = {
  args: { children: 'Button CTA', variant: 'primary', size: 'md', disabled: true },
}

export const Loading = {
  args: { children: 'Saving…', variant: 'primary', size: 'md', loading: true },
}

// ─── All sizes ────────────────────────────────────────────────────────────────

export const AllSizes = {
  name: 'All Sizes',
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">XLarge</Button>
    </div>
  ),
}

// ─── All hierarchies ─────────────────────────────────────────────────────────

export const AllHierarchies = {
  name: 'All Hierarchies',
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link-color">Link color</Button>
      <Button variant="link-gray">Link gray</Button>
    </div>
  ),
}

// ─── With icons ──────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4.167v11.666M4.167 10h11.666" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WithLeadingIcon = {
  name: 'Leading Icon',
  args: { children: 'Add item', variant: 'primary', size: 'md', leadingIcon: <PlusIcon /> },
}

export const WithTrailingIcon = {
  name: 'Trailing Icon',
  args: { children: 'Continue', variant: 'primary', size: 'md', trailingIcon: <ArrowIcon /> },
}

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" size="md" iconOnly leadingIcon={<PlusIcon />} aria-label="Add" />
      <Button variant="secondary" size="md" iconOnly leadingIcon={<PlusIcon />} aria-label="Add" />
      <Button variant="tertiary" size="md" iconOnly leadingIcon={<PlusIcon />} aria-label="Add" />
    </div>
  ),
}

// ─── States ───────────────────────────────────────────────────────────────────

export const States = {
  name: 'All States',
  render: () => (
    <div className="flex flex-col gap-4">
      {['primary', 'secondary', 'tertiary', 'destructive'].map(variant => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-24 text-sm text-text-tertiary capitalize">{variant}</span>
          <Button variant={variant}>Default</Button>
          <Button variant={variant} disabled>Disabled</Button>
          <Button variant={variant} loading>Loading</Button>
        </div>
      ))}
    </div>
  ),
}
