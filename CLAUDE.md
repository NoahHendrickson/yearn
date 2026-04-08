# Yearn — Claude Code Guidelines

## Project Overview
Yearn is a wishlist sharing platform. Users create wishlists, share them with family and friends, claim items as gifts, and organize everything into groups.

**Stack:** React 19, Vite, Supabase (auth + database + realtime + storage), React Router v7, Zustand, Tailwind CSS 4, Untitled UI design system, React Aria Components.

---

## Core Rule: Always Use the Design System

**Never write raw CSS, inline styles, or create new component files for UI that already exists.**

Before building any UI, check `src/components/` first. If a component exists, use it. If a Figma design is provided, match it using existing components and Tailwind tokens.

---

## Component Library

All components live in `src/components/`. Check here before writing any UI code.

### UI Primitives (`src/components/ui/`)
| Component | File | Notes |
|---|---|---|
| `Button` | `ui/Button.jsx` | variants: primary, secondary, tertiary, destructive, link-color, link-gray; sizes: xs, sm, md, lg, xl; props: leadingIcon, trailingIcon, iconOnly, loading |
| `Input` | `ui/Input.jsx` | props: label, hint, error, required, disabled, size (sm/md/lg), leadingIcon, trailingIcon; focused border uses brand color; error state shows alert icon + red hint |
| `Modal` | `ui/Modal.jsx` | handles Escape key and backdrop click |
| `Spinner` | `ui/Spinner.jsx` | loading state indicator |
| `EmptyState` | `ui/EmptyState.jsx` | empty list/page states with optional action |
| `PriceDisplay` | `ui/PriceDisplay.jsx` | formats price as USD currency |

### Layout (`src/components/layout/`)
| Component | File | Notes |
|---|---|---|
| `AppShell` | `layout/AppShell.jsx` | wraps all pages, includes TopNav + `<Outlet />` |
| `TopNav` | `layout/TopNav.jsx` | sticky nav with auth-aware links |
| `PageHeader` | `layout/PageHeader.jsx` | page title + subtitle + optional action slot |

### Lists (`src/components/lists/`)
| Component | File | Notes |
|---|---|---|
| `ListCard` | `lists/ListCard.jsx` | summary card linking to a list |
| `ListGrid` | `lists/ListGrid.jsx` | responsive grid of ListCards |
| `ListForm` | `lists/ListForm.jsx` | create/edit list metadata |
| `ItemCard` | `lists/ItemCard.jsx` | single wishlist item with claim button |
| `ItemForm` | `lists/ItemForm.jsx` | add/edit item (name, description, URL, price) |
| `ClaimButton` | `lists/ClaimButton.jsx` | claim/unclaim — hidden from list owner |

### Groups (`src/components/groups/`)
| Component | File | Notes |
|---|---|---|
| `ListGroupCard` | `groups/ListGroupCard.jsx` | card linking to a list group |
| `ListGroupForm` | `groups/ListGroupForm.jsx` | create/edit a list group |
| `AddListToGroupModal` | `groups/AddListToGroupModal.jsx` | modal to add a list to a group |

### People (`src/components/people/`)
| Component | File | Notes |
|---|---|---|
| `PeopleGroupCard` | `people/PeopleGroupCard.jsx` | card linking to a people group |
| `AddPersonModal` | `people/AddPersonModal.jsx` | add a person by username |

### Sharing (`src/components/sharing/`)
| Component | File | Notes |
|---|---|---|
| `ShareModal` | `sharing/ShareModal.jsx` | toggle public link + share with specific users |

---

## Storybook

Components are documented in Storybook. Run with `npm run storybook` (port 6006).

Story files live in `src/stories/`. When building or updating a component, always check if a story exists and keep it updated.

---

## State Management

Four Zustand stores in `src/stores/`:

| Store | File | Manages |
|---|---|---|
| `useAuthStore` | `stores/authStore.js` | session, profile, sign in/up/out |
| `useListStore` | `stores/listStore.js` | lists, items, claims CRUD |
| `useGroupStore` | `stores/groupStore.js` | list groups CRUD |
| `usePeopleGroupStore` | `stores/peopleGroupStore.js` | people groups CRUD |

Always use these stores for data fetching and mutations — never call Supabase directly from components.

---

## Design Tokens (Tailwind CSS 4)

Tokens are defined in `src/styles/theme.css` and available as Tailwind classes.

### Colors
```
text-text-primary        text-text-secondary      text-text-tertiary
text-text-placeholder    text-text-brand-primary  text-text-white

bg-bg-primary            bg-bg-secondary          bg-bg-tertiary
bg-bg-brand-primary      bg-bg-brand-secondary    bg-bg-brand-solid
bg-bg-error-primary      bg-bg-error-solid

border-border-primary    border-border-secondary  border-border-brand
border-border-error

text-fg-primary          text-fg-secondary        text-fg-tertiary
text-fg-brand-primary    text-fg-brand-secondary  text-fg-error-primary
```

### Brand Palette
```
brand-50 through brand-950 (purple scale)
```

### Typography
```
text-xs   text-sm   text-md   text-lg   text-xl
(with matching line-height variants via --line-height)
```

### Radius
```
rounded-none  rounded-xs  rounded-sm  rounded-md
rounded-lg    rounded-xl  rounded-2xl rounded-3xl rounded-full
```

### Shadows
```
shadow-xs  shadow-sm  shadow-md  shadow-lg  shadow-xl
```

---

## Routing

Routes are defined in `src/App.jsx`. Pages live in `src/pages/`.

| Route | Page | Auth required |
|---|---|---|
| `/` | `LandingPage` | No |
| `/auth` | `AuthPage` | No |
| `/dashboard` | `DashboardPage` | Yes |
| `/lists/:id` | `ListViewPage` | No (public lists) |
| `/lists/:id/edit` | `ListEditorPage` | Yes (owner only) |
| `/groups/:id` | `ListGroupPage` | Yes |
| `/people-groups/:id` | `PeopleGroupPage` | Yes |
| `/profile` | `ProfilePage` | Yes |

Use `useRequireAuth()` hook (`src/hooks/useRequireAuth.js`) for auth-protected pages.

---

## Supabase

The Supabase client singleton is at `src/lib/supabase.js`. Import it as:
```js
import { supabase } from '@/lib/supabase'
```

Never access Supabase directly in components — always go through the Zustand stores.

---

## Key Conventions

- **Path alias:** `@/` maps to `src/` — use it for all imports
- **No TypeScript** — plain JavaScript only
- **No new CSS files** — use Tailwind classes and design tokens
- **No inline styles** — use Tailwind classes
- **Components are CSS-module-based** (legacy) — new components should use Tailwind classes
- **Dark mode** — applied via `.dark-mode` class on the document root, managed by `ThemeProvider` (`src/providers/theme-provider.jsx`). Use `dark:` Tailwind variant.
- **Figma designs** — when a Figma URL is provided, read it with the Figma MCP tool then implement using existing components

---

## Database Schema (Supabase)

Tables: `profiles`, `lists`, `list_items`, `claims`, `list_shares`, `list_groups`, `list_group_members`, `list_group_shares`, `people_groups`, `people_group_members`

Key RLS rule: `claims` are hidden from the list owner — never expose claim data to the owner even in the UI.
