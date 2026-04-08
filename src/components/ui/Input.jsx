import PropTypes from 'prop-types'
import { cx } from '@/utils/cx'

const sizeClasses = {
  sm: 'h-9 px-3 py-2 text-sm gap-1.5',
  md: 'h-10 px-3.5 py-2.5 text-sm gap-2',
  lg: 'h-11 px-4 py-3 text-md gap-2',
}

export function Input({
  label,
  hint,
  error,
  required,
  disabled,
  size = 'md',
  leadingIcon,
  trailingIcon,
  id,
  className,
  ...props
}) {
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-fg-brand-primary">*</span>
          )}
        </label>
      )}

      <div
        className={cx(
          'relative flex items-center',
          'bg-bg-primary rounded-xl shadow-xs',
          'border border-border-primary',
          'transition-colors duration-150',
          'has-[:focus]:border-2 has-[:focus]:border-border-brand',
          hasError && 'border-border-error',
          disabled && 'opacity-50',
          sizeClasses[size],
          // reset padding when icons present — handled per slot below
        )}
      >
        {leadingIcon && (
          <span className="shrink-0 size-5 flex items-center justify-center text-fg-tertiary mr-2">
            {leadingIcon}
          </span>
        )}

        <input
          id={id}
          disabled={disabled}
          className={cx(
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-text-primary placeholder:text-text-placeholder',
            'disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />

        {(trailingIcon || hasError) && (
          <span className={cx(
            'shrink-0 size-5 flex items-center justify-center ml-2',
            hasError ? 'text-fg-error-primary' : 'text-fg-tertiary',
          )}>
            {hasError ? <AlertCircleIcon /> : trailingIcon}
          </span>
        )}
      </div>

      {(hint || error) && (
        <p className={cx(
          'text-sm',
          hasError ? 'text-fg-error-primary' : 'text-text-tertiary',
        )}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

function AlertCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

Input.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
}
