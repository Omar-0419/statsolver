import { notFound } from 'next/navigation'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROCEDURES, getProcedure } from '@/lib/solver/procedure-map'
import { UNIT_NAMES } from '@/lib/solver/patterns'

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ slug: p.id }))
}

export default async function CalculatorPage({ params }: PageProps<'/calculadoras/[slug]'>) {
  const { slug } = await params
  const procedure = getProcedure(slug)
  if (!procedure) notFound()

  const Comp = procedure.component
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title={procedure.name} subtitle={`${UNIT_NAMES[procedure.unit - 1]} — ${procedure.description}`} />
      <Comp />
    </div>
  )
}
