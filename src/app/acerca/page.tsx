import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Badge } from '@/components/ui/Badge'

const features = [
  'Dashboard con bienvenida, accesos a las cuatro unidades, calculadoras y casos de estudio',
  'Unidades 1-4 con teoría, fórmulas y calculadoras integradas',
  'Catálogo de 22 calculadoras estadísticas (media, proporciones, intervalos de confianza, pruebas de hipótesis, distribuciones)',
  'Solucionador de casos: resolución guiada y asistida automática con reglas locales',
  'Casos de estudio (8) con soluciones explicadas y comparación con el procedimiento realizado',
  'Modo claro/oscuro y diseño responsive',
  'Cálculos realizados localmente: sin servicios externos ni bases de datos',
]

export default function AcercaPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="Acerca del proyecto" subtitle="STAT SOLVER — Plataforma educativa de Estadística Inferencial" />

      <Card>
        <SectionTitle title="Descripción" subtitle="¿Qué es STAT SOLVER?" />
        <p className="text-ss-muted">
          STAT SOLVER es una plataforma web moderna, interactiva y académicamente rigurosa para el aprendizaje
          y la resolución de problemas de Estadística Inferencial. Permite estudiar conceptos, utilizar
          calculadoras automatizadas, introducir datos de problemas reales y resolver casos de estudio paso a
          paso. La aplicación funciona completamente en el entorno local, sin necesidad de conexión a
          servicios externos, bases de datos ni autenticación.
        </p>
      </Card>

      <Card>
        <SectionTitle title="Características principales" />
        <ul className="flex flex-col gap-2">
          {features.map((f) => (
            <li key={f} className="text-sm text-ss-fg">{f}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle title="Tecnologías utilizadas" />
        <div className="flex flex-wrap gap-2">
          {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Lucide React', 'Recharts 3', 'Vitest 5'].map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Datos y precisión" subtitle="Precisión matemática verificada" />
        <p className="text-ss-muted">
          Las calculadoras están implementadas en JavaScript con series de potencias y fracciones continuas
          (método de Lentz) para distribuciones normales, t de Student, Chi-cuadrado y gamma; binomial y
          Poisson con funciones especiales exactas. Cada calculadora muestra desarrollo matemático paso a
          paso, resultados y una interpretación en lenguaje natural.
        </p>
      </Card>
    </div>
  )
}
