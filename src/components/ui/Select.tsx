'use client'

import type { ReactNode, SelectHTMLAttributes } from 'react'

export function Select({
  label,
  help,
  error,
  className = '',
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode
  help?: ReactNode
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-ss-fg" htmlFor={rest.id}>
          {label}
        </label>
      ) : null}
      <select
        className={`h-10 w-full rounded-lg border border-ss-border bg-ss-input-bg px-3 text-ss-fg focus:outline-none focus:border-ss-primary focus:ring-2 focus:ring-ss-ring disabled:opacity-60 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {help ? <p className="text-xs text-ss-muted">{help}</p> : null}
      {error ? <p className="text-xs font-medium text-ss-danger">{error}</p> : null}
    </div>
  )
}
