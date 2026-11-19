import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  headerExtra?: ReactNode
  footer?: ReactNode
}

export function Card({ children, className = '', title, subtitle, headerExtra, footer }: CardProps) {
  return (
    <section className={`rounded-xl border border-ss-border bg-ss-surface shadow-sm ${className}`}>
      {(title || subtitle || headerExtra) && (
        <header className="flex items-center justify-between gap-4 border-b border-ss-border px-5 py-4">
          <div className="flex flex-col gap-0.5">
            {title ? <h3 className="text-base font-semibold text-ss-fg">{title}</h3> : null}
            {subtitle ? <p className="text-xs text-ss-muted">{subtitle}</p> : null}
          </div>
          {headerExtra ?? null}
        </header>
      )}
      <div className="px-5 py-5">{children}</div>
      {footer ? <footer className="border-t border-ss-border px-5 py-3">{footer}</footer> : null}
    </section>
  )
}
