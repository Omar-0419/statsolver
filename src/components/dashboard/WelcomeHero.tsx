import Link from 'next/link'
import { Sigma } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const highlights = [
  { label: 'Distribuciones', value: '6', description: 'Normal, binomial, Poisson, muestral' },
  { label: 'Calculadoras', value: '14+', description: 'Automatizadas e instantáneas' },
  { label: 'Casos prácticos', value: '6+', description: 'De Educación, Salud, Economía, Producción, Mercado, Investigación' },
  { label: 'Unidades académicas', value: '4', description: 'Estadística Inferencial completa' },
]

export function WelcomeHero() {
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-ss-primary/20 bg-ss-primary-muted px-3 py-1 text-xs font-semibold text-ss-primary">
            <Sigma className="h-3.5 w-3.5" /> Plataforma educativa de Estadística Inferencial
          </div>
          <h1 className="max-w-lg text-3xl font-bold tracking-tight text-ss-fg md:text-4xl">
            Aprende estadística inferencial con cálculos reales, interactivos y académicamente rigurosos
          </h1>
          <p className="max-w-xl text-sm leading-6 text-ss-muted">
            Explora las cuatro unidades, utiliza nuestras calculadoras automatizadas, resuelve casos de
            estudio paso a paso y obtén interpretaciones académicas de los resultados. Todo en español, sin
            necesidad de conocimientos avanzados de programación.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/unidad-1"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-ss-primary px-4 text-sm font-semibold text-ss-primary-fg transition-colors hover:bg-ss-primary-hover"
            >
              Empezar por la Unidad 1
            </Link>
            <Link
              href="/calculadoras"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-ss-border bg-ss-surface px-4 text-sm font-semibold text-ss-fg transition-colors hover:bg-ss-surface-elevated"
            >
              Ver calculadoras
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:pl-8">
          {highlights.map((h) => (
            <div key={h.label} className="rounded-lg border border-ss-border bg-ss-surface p-3">
              <p className="text-2xl font-bold text-ss-fg">{h.value}</p>
              <p className="text-xs text-ss-muted">{h.label}</p>
              <p className="mt-1 text-[11px] text-ss-muted/80">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
