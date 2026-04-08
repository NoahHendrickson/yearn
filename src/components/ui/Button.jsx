import PropTypes from 'prop-types'
import { cx } from '@/utils/cx'

// Size styles — matches Figma: xs=32px, sm=36px, md=40px, lg=44px, xl=48px
const sizeClasses = {
  xs: 'h-8 px-3 py-1.5 text-xs gap-1',
  sm: 'h-9 px-3.5 py-2 text-sm gap-1',
  md: 'h-10 px-3.5 py-2.5 text-sm gap-1',
  lg: 'h-11 px-4 py-2.5 text-md gap-1.5',
  xl: 'h-12 px-[18px] py-3 text-md gap-1.5',
}

// Icon-only sizes (square)
const iconOnlySizeClasses = {
  xs: 'h-8 w-8 p-1.5',
  sm: 'h-9 w-9 p-2',
  md: 'h-10 w-10 p-2.5',
  lg: 'h-11 w-11 p-3',
  xl: 'h-12 w-12 p-3',
}

// Hierarchy (variant) styles
const hierarchyClasses = {
  primary: cx(
    'bg-bg-brand-solid text-text-white border-2 border-white/[0.12] shadow-xs',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
  ),
  secondary: cx(
    'bg-bg-primary text-text-secondary border border-border-primary shadow-xs',
    'hover:bg-bg-secondary hover:text-text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
  ),
  tertiary: cx(
    'bg-transparent text-text-tertiary',
    'hover:bg-bg-secondary hover:text-text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
  ),
  destructive: cx(
    'bg-bg-error-solid text-text-white shadow-xs',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
  ),
  'link-color': cx(
    'bg-transparent text-fg-brand-primary px-0 h-auto',
    'hover:text-fg-brand-secondary',
    'focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-focus-ring',
  ),
  'link-gray': cx(
    'bg-transparent text-text-tertiary px-0 h-auto',
    'hover:text-text-primary',
    'focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-focus-ring',
  ),
  // Aliases for backward compatibility
  ghost: cx(
    'bg-transparent text-fg-brand-primary',
    'hover:bg-bg-brand-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
  ),
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  onClick,
  type = 'button',
  className,
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cx(
        // Base
        'relative inline-flex items-center justify-center font-semibold rounded-xl',
        'whitespace-nowrap cursor-pointer transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Hover overlay — 8% white on top of background
        'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none',
        'before:bg-white/0 hover:before:bg-white/[0.08] before:transition-colors before:duration-150',
        // Size
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        // Hierarchy
        hierarchyClasses[variant] ?? hierarchyClasses.primary,
        className,
      )}
    >
      {loading ? (
        <Spinner size={size} />
      ) : (
        <>
          {leadingIcon && (
            <span className="shrink-0 size-5 flex items-center justify-center">
              {leadingIcon}
            </span>
          )}
          {!iconOnly && children}
          {iconOnly && !leadingIcon && children}
          {trailingIcon && !iconOnly && (
            <span className="shrink-0 size-5 flex items-center justify-center">
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </button>
  )
}

// Internal spinner — matches button size
function Spinner({ size }) {
  const spinnerSize = { xs: 'size-3', sm: 'size-3.5', md: 'size-4', lg: 'size-4', xl: 'size-5' }
  return (
    <span
      className={cx(
        'block rounded-full border-2 border-current border-t-transparent animate-spin',
        spinnerSize[size],
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'tertiary', 'destructive',
    'link-color', 'link-gray',
    'ghost', // legacy alias
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  iconOnly: PropTypes.bool,
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
}
