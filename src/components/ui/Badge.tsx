import type { ReactNode } from 'react'

const VARIANTS: Record<string, string> = {
  default: 'border-ss-border text-ss-muted bg-ss-surface-elevated',
  primary: 'border-ss-primary/20 bg-ss-primary-muted text-ss-primary',
  success: 'border-ss-success/20 bg-ss-success-muted text-ss-success',
  danger: 'border-ss-danger/20 bg-ss-danger-muted text-ss-danger',
  warning: 'border-ss-warning/20 bg-ss-warning-muted text-ss-warning',
}

export function Badge({
  variant = 'default',
  children,
  className = '',
}: {
  variant?: keyof typeof VARIANTS
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  )
}
