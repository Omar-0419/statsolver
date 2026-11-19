import { SectionTitle } from '@/components/ui/SectionTitle'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  CIMediaZCalc,
  CIMediaTcalc,
  CIproporcionCalc,
  CIdifMediasCalc,
  CIdifProporcionesCalc,
} from '@/components/calculators/confidence'

const theoryCard = (title: string, subtitle: string, concepts: string[], formula?: string) => (
  <Card>
    <div className="flex flex-col gap-4">
      <SectionTitle title={title} subtitle={subtitle} />
      <ul className="flex flex-col gap-2">
        {concepts.map((c) => (
          <li key={c} className="text-sm text-ss-muted">
            {c}
          </li>
        ))}
      </ul>
      {formula ? (
        <div className="rounded-md border border-ss-border bg-ss-surface-elevated px-3 py-2.5 font-mono text-sm text-ss-fg">
          {formula}
        </div>
      ) : null}
    </div>
  </Card>
)

export function Unit3Content() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Unidad 3 — Intervalos de confianza"
        subtitle="Teoría y herramientas para establecer intervalos sobre parámetros desconocidos"
      />
      <Badge variant="primary">Intervalos · Z · T de Student · Diferencias</Badge>

      {theoryCard(
        'Intervalos de confianza',
        'Estimación de un parámetro mediante un rango de valores plausibles',
        [
          'Un intervalo de confianza al nivel (1−α) para µ es: (X̄ − ME, X̄ + ME).',
          'Margen de error ME = z_{α/2}·SE.',
          'Para una proporción: p̂ ± z_{α/2}·√[p̂(1−p̂)/n].',
          'Para diferencias: (X̄₁ − X̄₂) ± ME con SE = √[s₁²/n₁ + s₂²/n₂] (Welch) o σ₁ = σ₂ con varianzas agrupadas.',
          'Interpretación: si se toman muchas muestras, el 100·(1−α) % de los intervalos contiene el verdadero valor del parámetro.',
        ],
      )}

      {theoryCard(
        'Intervalos con distribución Z',
        'Cuando la desviación poblacional σ es conocida',
        [
          'X̄ ~ N(µ, σ²/n) ⇒ µ ∈ X̄ ± z_{α/2}·σ/√n.',
          'Valores críticos bilaterales: ±z_{α/2}; unilaterales: z_{α} o −z_{α}.',
          'Ejemplo: σ = 2, n = 36, X̄ = 10, nivel 95 % → µ ∈ [9.3467, 10.6533].',
        ],
        'X̄ ± z_{α/2}·(σ/√n)',
      )}

      {theoryCard(
        'Intervalos con distribución T de Student',
        'Cuando la desviación poblacional σ es desconocida y se usa s',
        [
          'X̄ ~ t(µ, s²/n) con gl = n − 1.',
          'µ ∈ X̄ ± t_{α/2, gl}·(s/√n), donde t_{α/2, gl} es la cuantil de la t de Student.',
          'Los intervalos t son más amplios que los z; reflejan la incertidumbre adicional de estimar σ con s.',
        ],
        'X̄ ± t_{α/2, gl}·(s/√n)',
      )}

      {theoryCard(
        'Diferencia entre dos medias',
        'Intervalos sobre µ₁ − µ₂',
        [
          'Varianzas conocidas: SE = √[s₁²/n₁ + s₂²/n₂], usando z.',
          'Varianzas desconocidas: Welch–Satterthwaite, usando t con gl = (v₁+v₂)²/(v₁²/(n₁−1) + v₂²/(n₂−1)).',
          '(X̄₁ − X̄₂) ± t·SE.',
        ],
        '(X̄₁ − X̄₂) ± t_{α/2, gl}·√[s₁²/n₁ + s₂²/n₂]',
      )}

      {theoryCard(
        'Diferencia entre dos proporciones',
        'Intervalos sobre p₁ − p₂',
        [
          'SE = √[p̂(1−p̂)·(1/n₁ + 1/n₂)] con p̂ = (x₁ + x₂)/(n₁ + n₂) — proporciones agrupadas.',
          '(p̂₁ − p̂₂) ± z_{α/2}·SE.',
        ],
        '(p̂₁ − p̂₂) ± z_{α/2}·√[p̂(1−p̂)(1/n₁ + 1/n₂)]',
      )}

      <div className="flex flex-col gap-6">
        <SectionTitle title="Calculadoras de esta unidad" subtitle="Intervalos de confianza con distribuciones Z y T" />
        <CIMediaZCalc />
        <CIMediaTcalc />
        <CIproporcionCalc />
        <CIdifMediasCalc />
        <CIdifProporcionesCalc />
      </div>
    </div>
  )
}
