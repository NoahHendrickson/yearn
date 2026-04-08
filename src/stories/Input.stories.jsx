import { Input } from '@/components/ui/Input'

export default {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input field matching Untitled UI design system. Supports label, hint, error, required, leading/trailing icons, and three sizes.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'This is a hint text to help the user.',
    id: 'email-default',
  },
}

export const Required = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
    hint: "We'll only use this for account recovery.",
    id: 'email-required',
  },
}

export const Filled = {
  args: {
    label: 'Email',
    defaultValue: 'noah@example.com',
    hint: 'This is a hint text to help the user.',
    id: 'email-filled',
  },
}

export const WithError = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: 'This is an error message.',
    required: true,
    id: 'email-error',
  },
}

export const Disabled = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'This is a hint text to help the user.',
    disabled: true,
    id: 'email-disabled',
  },
}

export const WithLeadingIcon = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'This is a hint text to help the user.',
    leadingIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    id: 'email-leading-icon',
  },
}

export const SizeSm = {
  name: 'Size: sm',
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'sm',
    id: 'email-sm',
  },
}

export const SizeMd = {
  name: 'Size: md',
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'md',
    id: 'email-md',
  },
}

export const SizeLg = {
  name: 'Size: lg',
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    size: 'lg',
    id: 'email-lg',
  },
}

export const AllSizes = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Input label="Small" placeholder="Size sm" size="sm" id="size-sm" />
      <Input label="Medium" placeholder="Size md" size="md" id="size-md" />
      <Input label="Large" placeholder="Size lg" size="lg" id="size-lg" />
    </div>
  ),
}

export const AllStates = {
  render: () => (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Input label="Default" placeholder="Placeholder text" hint="Hint text goes here." id="state-default" />
      <Input label="Filled" defaultValue="noah@example.com" hint="Hint text goes here." id="state-filled" />
      <Input label="Error" placeholder="Placeholder text" error="This field is required." required id="state-error" />
      <Input label="Disabled" placeholder="Placeholder text" hint="Hint text goes here." disabled id="state-disabled" />
    </div>
  ),
}
