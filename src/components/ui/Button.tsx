import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'

export type ButtonProps = {
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
  href?: string
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'ref'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'ref' | 'href'>

export function Button({
  ref,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-ring disabled:pointer-events-none disabled:opacity-60'

  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size]

  const variantClass = {
    primary: 'bg-ss-primary text-ss-primary-fg hover:bg-ss-primary-hover',
    secondary: 'border border-ss-border bg-ss-surface text-ss-fg hover:bg-ss-surface-elevated',
    ghost: 'text-ss-fg hover:bg-ss-surface-elevated',
    danger: 'bg-ss-danger text-ss-danger-fg hover:bg-ss-danger-hover',
  }[variant]

  const classes = `${base} ${sizeClass} ${variantClass} ${className}`
  const spinner = loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null

  if (href) {
    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)}
      >
        {children}
        {spinner}
      </Link>
    )
  }

  const { disabled, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button ref={ref as Ref<HTMLButtonElement>} className={classes} {...buttonRest} disabled={loading || disabled}>
      {children}
      {spinner}
    </button>
  )
}
