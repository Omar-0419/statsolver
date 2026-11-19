import Link from 'next/link'
import { Book, BookOpen, Calculator, PieChart, TrendingUp } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { WelcomeHero } from '@/components/dashboard/WelcomeHero'
import { UnitCard } from '@/components/dashboard/UnitCard'

const unidades = [
  {
    id: 'unidad-1',
    title: 'Unidad 1 — Distribuciones muestrales',
    path: '/unidad-1',
    description:
      'Distribución normal, binomial, Poisson, distribución muestral de la media y de la proporción, error estándar y TELEM.',
    topics: ['Normal', 'Binomial', 'Poisson', 'Media muestral', 'Proporción muestral', 'Error estándar', 'CLT'],
    icon: BookOpen,
    difficulty: 'Introductorio' as const,
  },
  {
    id: 'unidad-2',
    title: 'Unidad 2 — Estimación y muestreo',
    path: '/unidad-2',
    description:
      'Población y muestra, parámetros y estadísticos, muestreo probabilístico y no probabilístico, estimación puntual y tamaño de muestra.',
    topics: ['Población', 'Muestra', 'Parámetros', 'Estadísticos', 'Estimación puntual', 'Tamaño de muestra'],
    icon: Calculator,
    difficulty: 'Intermedio' as const,
  },
  {
    id: 'unidad-3',
    title: 'Unidad 3 — Intervalos de confianza',
    path: '/unidad-3',
    description:
      'Intervalos para una media y una proporción, diferencias entre medias e intervalos con distribuciones Z y T de Student.',
    topics: ['Media', 'Proporción', 'Diferencia de medias', 'Diferencia de proporciones', 'Z', 'T de Student'],
    icon: PieChart,
    difficulty: 'Intermedio' as const,
  },
  {
    id: 'unidad-4',
    title: 'Unidad 4 — Pruebas de hipótesis',
    path: '/unidad-4',
    description:
      'Hipótesis nula y alternativa, estadísticos de prueba, valores p, errores tipo, pruebas unilaterales y bilaterales.',
    topics: ['Hipótesis nula', 'Valor p', 'Errores tipo', 'Unilateral', 'Bilateral', 'Chi-cuadrado'],
    icon: TrendingUp,
    difficulty: 'Intermedio' as const,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHero />

      <div className="flex flex-col gap-3">
        <SectionTitle
          title="Acceso directo a las unidades"
          subtitle="Cada unidad tiene teoría, fórmulas, ejemplos y calculadoras integradas."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {unidades.map((u) => (
            <UnitCard key={u.id} {...u} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/calculadoras" className="flex items-center justify-between gap-3 rounded-xl border border-ss-border bg-ss-surface p-4 hover:border-ss-primary/30">
          <span className="text-sm font-medium text-ss-fg">Calculadoras estadísticas</span>
          <Calculator className="h-5 w-5 text-ss-muted" />
        </Link>
        <Link href="/solucionador" className="flex items-center justify-between gap-3 rounded-xl border border-ss-border bg-ss-surface p-4 hover:border-ss-primary/30">
          <span className="text-sm font-medium text-ss-fg">Solucionador de problemas</span>
          <BookOpen className="h-5 w-5 text-ss-muted" />
        </Link>
        <Link href="/casos-estudio" className="flex items-center justify-between gap-3 rounded-xl border border-ss-border bg-ss-surface p-4 hover:border-ss-primary/30">
          <span className="text-sm font-medium text-ss-fg">Casos de estudio</span>
          <Book className="h-5 w-5 text-ss-muted" />
        </Link>
      </div>
    </div>
  )
}
