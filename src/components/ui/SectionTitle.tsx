export function SectionTitle({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-ss-fg">{title}</h2>
      {subtitle ? <p className="text-sm text-ss-muted">{subtitle}</p> : null}
    </div>
  )
}
