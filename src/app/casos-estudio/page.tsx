import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { StudyCaseCard } from '@/components/study-cases/StudyCaseCard'
import { studyCases } from '@/lib/data/study-cases'

export default function CasosEstudioPage() {
  const units = [1, 2, 3, 4].map((u) => studyCases.filter((c) => c.unit === u))

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Casos de estudio"
        subtitle="Problemas realistas organizados por unidad, con soluciones explicadas"
      />
      <div className="grid gap-6 xl:grid-cols-4">
        {units.map((unitCases, i) => (
          <Card key={i + 1} className="flex flex-col gap-4">
            <SectionTitle
              title={`Unidad ${i + 1}`}
              subtitle={unitCases.length > 0 ? `${unitCases.length} casos disponibles` : 'Próximamente'}
            />
            <div className="flex flex-col gap-3">
              {unitCases.length === 0
                ? <p className="text-sm text-ss-muted">No hay casos disponibles en esta unidad aún.</p>
                : unitCases.map((c) => <StudyCaseCard key={c.id} studyCase={c} />)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
