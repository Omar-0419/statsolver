'use client'

import type { ReactNode } from 'react'

export function Textarea({
  label,
  help,
  error,
  className = '',
  children,
  ...rest
}: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> & {
  label?: ReactNode
  help?: ReactNode
  error?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-ss-fg" htmlFor={rest.id}>
          {label}
        </label>
      ) : null}
      <textarea
        className={`min-h-24 w-full rounded-lg border border-ss-border bg-ss-input-bg px-3 py-2.5 text-sm text-ss-fg placeholder:text-ss-muted focus:outline-none focus:border-ss-primary focus:ring-2 focus:ring-ss-ring disabled:opacity-60 ${className}`}
        {...rest}
      >
        {children}
      </textarea>
      {help ? <p className="text-xs text-ss-muted">{help}</p> : null}
      {error ? <p className="text-xs font-medium text-ss-danger">{error}</p> : null}
    </div>
  )
}
