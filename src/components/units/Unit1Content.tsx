import { SectionTitle } from '@/components/ui/SectionTitle'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  ProbNormalCalc,
  ProbBinomialCalc,
  ProbPoissonCalc,
  DistMuestralMediaCalc,
  DistMuestralProporcionCalc,
} from '@/components/calculators/distributions'

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

export function Unit1Content() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Unidad 1 — Distribuciones muestrales"
        subtitle="Fondamento teórico y herramientas para estudiar variables aleatorias y distribuciones de muestreo"
      />
      <Badge variant="primary">Distribuciones muestrales · Introductory</Badge>

      {theoryCard(
        'Distribución normal',
        'La distribución más importante de la estadística inferencial: la variable aleatoria X ~ N(µ, σ²)',
        [
          'Familia de curvas simétricas, unimodales y asintóticas a cero en ambas colas.',
          'Densidad de probabilidad: f(x) = (1/(σ√(2π)))·exp(−(x−µ)²/(2σ²))',
          'Función de distribución acumulada: P(X ≤ x) = Φ((x−µ)/σ) = ½·[1 + erf((x−µ)/(σ√2))]',
          'El 68.27 % de los valores se encuentran a una desviación estándar de la media; el 95.45 % a dos desviaciones.',
          'Valores σ > 0, µ ∈ ℝ y función de cuantiles definida por la tabla Φ.',
        ],
        'X ~ N(µ, σ²), f(x) = (1/(σ√(2π)))·exp(−(x−µ)²/(2σ²))',
      )}

      {theoryCard(
        'Distribución binomial',
        'Número de éxitos en n ensayos independientes con probabilidad constante p',
        [
          'Modelo de n ensayos de Bernoulli independientes.',
          'X ~ Binomial(n, p), n entero positivo, 0 ≤ p ≤ 1.',
          'Probabilidad puntual: P(X = k) = C(n,k)·p^k·(1−p)^(n−k), k ∈ {0,…,n}.',
          'Probabilidad acumulada: P(X ≤ k) = I_{1−p}(n−k, k+1) (función beta regularizada).',
          'Media µ = n·p y varianza σ² = n·p·(1−p).',
        ],
        'P(X = k) = C(n,k)·p^k·(1−p)^(n−k)',
      )}

      {theoryCard(
        'Distribución de Poisson',
        'Número de ocurrencias de un evento en un intervalo fijo',
        [
          'X ~ Poisson(λ), λ > 0 es la tasa media de ocurrencia por unidad de tiempo o espacio.',
          'Probabilidad puntual: P(X = k) = (λ^k·e^(−λ))/k!',
          'Probabilidad acumulada: P(X ≤ k) = Σ_{i=0}^k P(X = i).',
          'Media µ = λ y varianza σ² = λ.',
          'Ideal para eventos raros en intervalos largos (llegadas de pacientes, defectos por unidad, llamadas por minuto).',
        ],
        'P(X = k) = (λ^k·e^(−λ))/k!',
      )}

      {theoryCard(
        'Distribución muestral de la media',
        'Comportamiento de la media de una muestra aleatoria X̄',
        [
          'Si X ~ N(µ, σ²) y la muestra es grande o X es normal, X̄ ~ N(µ, σ²/n).',
          'El estadístico Z = (X̄ − µ)/(σ/√n) sigue aproximadamente N(0, 1).',
          'La media de la distribución muestral es E[X̄] = µ (el estimador es insesgado).',
          'El error estándar de X̄ es σ/√n; disminuye a medida que crece n.',
        ],
        'Z = (X̄ − µ) / (σ/√n), P(X̄ ≤ x̄) = Φ(Z), P(X̄ > x̄) = 1 − Φ(Z)',
      )}

      {theoryCard(
        'Distribución muestral de la proporción',
        'Comportamiento de la proporción de éxitos p̂ en una muestra',
        [
          'p̂ = X/n, donde X es el número de éxitos en una muestra aleatoria de tamaño n.',
          'Si np ≥ 10 y n(1−p) ≥ 10, p̂ es aproximadamente normal: p̂ ~ N(p, p(1−p)/n).',
          'El estadístico Z = (p̂ − p)/√[p(1−p)/n] sigue aproximadamente N(0, 1).',
          'La desviación estándar de p̂ es √[p(1−p)/n]; disminuye al crecer n.',
        ],
        'Z = (p̂ − p) / √[p(1−p)/n]',
      )}

      {theoryCard(
        'Error estándar',
        'Estimación de la desviación estándar del estimador puntual',
        [
          'SE(X̄) = σ/√n — desviación estándar de la media muestral.',
          'SE(p̂) = √[p(1−p)/n] — desviación estándar de la proporción muestral.',
          'En práctica, σ se sustituye por su estimación s/√n cuando no se conoce el valor poblacional.',
          'Mide el ajuste promedio del estimador a la verdad: un SE pequeño indica una estimación más precisa.',
        ],
        'SE(X̄) = σ/√n, SE(p̂) = √[p(1−p)/n]',
      )}

      {theoryCard(
        'Teorema del límite central (TLC)',
        'Base del uso de la normal en estadística inferencial',
        [
          'Si X₁, …, Xₙ son variables aleatorias independientes e idénticamente distribuidas con media µ y varianza finita σ², la media de la muestra X̄ converge a una distribución normal a medida que n → ∞.',
          'Media de X̄: µ = E[X̄].',
          'Varianza de X̄: σ²/n.',
          'Consecuencia: podemos aplicar métodos de inferencia (intervalos de confianza, pruebas de hipótesis) basados en la distribución normal sin conocer la forma de la distribución original de X.',
          'El TLC justifica el uso de la distribución Z = (X̄ − µ)/(σ/√n) en prácticamente todas las prácticas de este curso.',
        ],
      )}

      <div className="flex flex-col gap-6">
        <SectionTitle title="Calculadoras de esta unidad" subtitle="Ejecutan en línea los cálculos de probabilidades y distribuciones muestrales" />
        <ProbNormalCalc />
        <ProbBinomialCalc />
        <ProbPoissonCalc />
        <DistMuestralMediaCalc />
        <DistMuestralProporcionCalc />
      </div>
    </div>
  )
}
