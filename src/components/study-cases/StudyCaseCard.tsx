import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { UNIT_NAMES } from '@/lib/solver/patterns'
import type { StudyCase } from '@/lib/data/study-cases'

export function StudyCaseCard({ studyCase }: { studyCase: StudyCase }) {
  const unitTone = studyCase.unit === 1 ? 'primary' : studyCase.unit === 2 ? 'success' : studyCase.unit === 3 ? 'accent' : 'primary'
  const diffTone = studyCase.dificultad === 'Introductorio' ? 'success' : studyCase.dificultad === 'Intermedio' ? 'warning' : 'danger'
  return (
    <Link
      href={`/casos-estudio/${studyCase.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-ss-border bg-ss-surface p-5 transition-colors hover:border-ss-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-ss-fg">{studyCase.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant={unitTone}>{UNIT_NAMES[studyCase.unit - 1]}</Badge>
            <Badge variant={diffTone}>{studyCase.dificultad}</Badge>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-ss-muted transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="text-sm text-ss-muted">{studyCase.contexto}</p>
    </Link>
  )
}
