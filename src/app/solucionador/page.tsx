import { Badge } from '@/components/ui/Badge'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { GuidedSolver } from '@/components/solver/GuidedSolver'
import { AutoSolver } from '@/components/solver/AutoSolver'

export default function SolucionadorPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Solucionador de casos"
        subtitle="Resolución estructurada de problemas estadísticos paso a paso, sin necesidad de IA externa"
      />
      <Badge variant="primary">Resolución guiada · Resolución asistida automática</Badge>

      <GuidedSolver />

      <div className="h-px w-full bg-ss-border" />

      <AutoSolver />
    </div>
  )
}
