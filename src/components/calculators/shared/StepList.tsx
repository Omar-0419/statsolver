import { CopyButton } from '@/components/ui/CopyButton'

export interface Step {
  label: string
  value: string
}

export function StepList({
  formula,
  steps,
  copyText,
}: {
  formula?: string
  steps: Step[]
  copyText?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      {formula ? (
        <div className="rounded-md border border-ss-border bg-ss-surface-elevated px-3 py-2.5 font-mono text-sm text-ss-fg">
          {formula}
        </div>
      ) : null}
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ss-primary-muted text-xs font-semibold text-ss-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ss-muted">{s.label}</p>
              <p className="mt-0.5 break-all font-mono text-sm text-ss-fg">{s.value}</p>
            </div>
          </li>
        ))}
      </ol>
      {copyText ? (
        <div>
          <CopyButton value={copyText} />
        </div>
      ) : null}
    </div>
  )
}
