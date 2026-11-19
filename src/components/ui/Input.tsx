'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  help?: ReactNode
  error?: string
}

export function Input({ label, help, error, className = '', ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-ss-fg" htmlFor={rest.id}>
          {label}
        </label>
      ) : null}
      <input
        className={`h-10 w-full rounded-lg border border-ss-border bg-ss-input-bg px-3 text-ss-fg placeholder:text-ss-muted focus:outline-none focus:border-ss-primary focus:ring-2 focus:ring-ss-ring disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...rest}
      />
      {help ? <p className="text-xs text-ss-muted">{help}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-ss-danger">{error}</p>
      ) : null}
    </div>
  )
}
