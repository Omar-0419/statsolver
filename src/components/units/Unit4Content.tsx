import { SectionTitle } from '@/components/ui/SectionTitle'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  PruebaZMediaCalc,
  PruebaTMediaCalc,
  PruebaZProporcionCalc,
  PruebaDifMediasCalc,
  PruebaDifProporcionesCalc,
  Chi2IndependenciaCalc,
  Chi2BondadAjusteCalc,
} from '@/components/calculators/hypothesis'

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

export function Unit4Content() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Unidad 4 — Pruebas de hipótesis"
        subtitle="Teoría y herramientas para decisiones estadísticas con intervalos de confianza y valores p"
      />
      <Badge variant="primary">Hipótesis · Pruebas · Valores p · Errores tipo</Badge>

      {theoryCard(
        'Hipótesis nula y alternativa',
        ' Marco para la decisión: H₀ contra H₁',
        [
          'H₀ (nula): supuesto a ser testeado, generalmente la "sin efecto" o el valor actual.',
          'H₁ (alternativa): lo que se sospecha; puede ser bilateral, unilateral menor o unilateral mayor.',
          'Resultado de la prueba: rechazo o no rechazo de H₀.',
          'Interpretación: si se rechaza H₀, los datos contienen evidencia de la alternativa; si no, no hay evidencia en contra de H₀.',
        ],
      )}

      {theoryCard(
        'Estadístico de prueba',
        'Cantidad calculada a partir de la muestra',
        [
          'Toma la forma de un estadístico estándar (Z o T), al que se le asigna un valor crítico bajo H₀.',
          'Z = (X̄ − µ₀)/(σ/√n), t = (X̄ − µ₀)/(s/√n) con gl = n − 1.',
          'Valores que están cerca del valor esperado bajo H₀ sugieren no rechazo.',
        ],
        'z = (X̄ − µ₀) / (σ/√n)',
      )}

      {theoryCard(
        'Valor p',
        'Probabilidad de observar un estadístico tan extremo como el obtenido, bajo H₀',
        [
          'Bilateral: p = 2·(1 − Φ(|z|)) — regiones en ambas colas.',
          'Unilateral menor: p = Φ(z) — región a la izquierda.',
          'Unilateral mayor: p = 1 − Φ(z) — región a la derecha.',
          'Regla práctica: si p < α, se rechaza H₀; si p ≥ α, no se rechaza.',
        ],
      )}

      {theoryCard(
        'Región crítica',
        'Valores del estadístico para los cuales se rechaza H₀',
        [
          'Valor crítico bilateral: z_{α/2} (regiones |z| > z_{α/2}).',
          'Valor crítico unilateral menor: −z_{α} (rechazo si z < −z_{α}).',
          'Valor crítico unilateral mayor: z_{α} (rechazo si z > z_{α}).',
          'Gráficamente, es la región sombreada en el gráfico de la densidad de la distribución bajo H₀.',
        ],
      )}

      {theoryCard(
        'Errores tipo y potencia',
        'Error inherente al procedimiento de decisión',
        [
          'Error tipo I: rechazar H₀ cuando es verdaderamente verdadera (nivel de significancia α).',
          'Error tipo II (β): no rechazar H₀ cuando es falsa.',
          'Potencia = 1 − β: probabilidad de detectar una diferencia cuando existe.',
          'Balance: reducir α enfriando la prueba (mayor β); aumentar n reduce β sin penalizar α.',
        ],
      )}

      {theoryCard(
        'Pruebas unilaterales y bilaterales',
        'Elección según el interés de la investigación',
        [
          'Bilateral: se rechaza H₀ cuando el estadístico está en ambas colas; se usa para probar cambios en ambos sentidos.',
          'Unilateral menor (H₁: µ < µ₀): se rechaza si el estadístico es demasiado bajo.',
          'Unilateral mayor (H₁: µ > µ₀): se rechaza si el estadístico es demasiado alto.',
          'Elegir unilateral cuando el estudio previo o el contexto indica dirección clara; bilateral en ausencia de información previa.',
        ],
      )}

      <div className="flex flex-col gap-6">
        <SectionTitle title="Calculadoras de esta unidad" subtitle="Pruebas de hipótesis con Z, T, Chi-cuadrado" />
        <PruebaZMediaCalc />
        <PruebaTMediaCalc />
        <PruebaZProporcionCalc />
        <PruebaDifMediasCalc />
        <PruebaDifProporcionesCalc />
        <Chi2IndependenciaCalc />
        <Chi2BondadAjusteCalc />
      </div>
    </div>
  )
}
