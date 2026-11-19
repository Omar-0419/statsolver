import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROCEDURES, proceduresByUnit } from '@/lib/solver/procedure-map'
import { UNIT_NAMES } from '@/lib/solver/patterns'
import Link from 'next/link'

export default function CalculadorasPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Calculadoras estadísticas"
        subtitle="Catálogo de herramientas automatizadas, cada una con su propia interfaz"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROCEDURES.map((p) => (
          <Link
            key={p.id}
            href={`/calculadoras/${p.id}`}
            className="group flex flex-col gap-3 rounded-xl border border-ss-border bg-ss-surface p-5 transition-colors hover:border-ss-primary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <Badge variant={p.unit === 4 ? 'primary' : 'accent'}>{UNIT_NAMES[p.unit - 1]}</Badge>
              <ArrowRight className="h-5 w-5 text-ss-muted transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="font-semibold text-ss-fg">{p.name}</h3>
            <p className="text-sm text-ss-muted">{p.description}</p>
            <p className="text-xs text-ss-muted">Fórmula: {p.formula}</p>
          </Link>
        ))}
      </div>

      <div className="text-sm text-ss-muted">
        Total: {PROCEDURES.length} calculadoras · Unidades disponibles:{' '}
        {[1, 2, 3, 4].map((u) => `${u}:${proceduresByUnit(u).length}`).join(', ')}
      </div>
    </div>
  )
}
