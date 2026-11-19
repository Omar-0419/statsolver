import type { ComponentType } from 'react'
import { Card } from '@/components/ui/Card'

type StatCardTone = 'primary' | 'muted' | 'accent' | 'success' | 'danger'

type StatCardProps = {
  label: string
  value: string
  icon?: ComponentType<{ className?: string }>
  tone?: StatCardTone
  description?: string
}

const TONES: Record<StatCardTone, string> = {
  primary: 'bg-ss-primary-muted text-ss-primary',
  muted: 'bg-ss-surface-elevated text-ss-muted',
  accent: 'bg-ss-accent-muted text-ss-accent',
  success: 'bg-ss-success-muted text-ss-success',
  danger: 'bg-ss-danger-muted text-ss-danger',
}

export function StatCard({ label, value, icon: Icon, tone = 'primary', description }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ss-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ss-fg">{value}</p>
          {description ? <p className="mt-1 text-xs text-ss-muted">{description}</p> : null}
        </div>
        {Icon ? <div className={`rounded-lg p-2.5 ${TONES[tone]}`}><Icon className="h-5 w-5" /></div> : null}
      </div>
    </Card>
  )
}
