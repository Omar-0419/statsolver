import { SectionTitle } from '@/components/ui/SectionTitle'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  EstimacionMediaCalc,
  EstimacionProporcionCalc,
  ErrorEstandarCalc,
  TamanoMuestraMediaCalc,
  TamanoMuestraProporcionCalc,
} from '@/components/calculators/estimation'

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

export function Unit2Content() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title="Unidad 2 — Estimación y muestreo"
        subtitle="Conceptos sobre población, muestra, parámetros, estimadores y tamaño de muestra"
      />
      <Badge variant="primary">Estimación · Tamaños de muestra · Muestreo</Badge>

      {theoryCard(
        'Población y muestra',
        'Universo sobre el que se estudia una característica',
        [
          'Población finita: el conjunto de unidades existentes (tamaño N).',
          'Población infinita: procesos que generan un flujo de unidades (tiempo, producción, pedidos).',
          'Muestra: subconjunto representativo de la población sobre el que se observan los datos.',
          'El muestreo es el proceso de selección de una muestra; el estimado se calcula a partir de la muestra.',
        ],
      )}

      {theoryCard(
        'Parámetros y estadísticos',
        'Características numéricas de población y muestra',
        [
          'Parámetro: constante desconocida que describe a la población (µ, σ², p, N).',
          'Estadístico: valor computado a partir de la muestra (X̄, s², p̂).',
          'Los estadísticos son variables aleatorias; los parámetros son constantes fijas.',
          'Un estimador es insesgado si su valor esperado coincide con el parámetro estimado.',
        ],
      )}

      {theoryCard(
        'Muestreo probabilístico',
        'Selección aleatoria: cada elemento de la población tiene una probabilidad conocida de ser elegido',
        [
          'Muestreo aleatorio simple: todas las muestras del tamaño n tienen la misma probabilidad de selección.',
          'Muestreo estratificado: la población se divide en estratos y se extrae una muestra de cada uno.',
          'Muestreo por etapas y en grupos: primero se selecciona una muestra de grupos, luego se extraen submuestras.',
          'Ventaja: los resultados son representativos y la variabilidad es controlable.',
        ],
      )}

      {theoryCard(
        'Muestreo no probabilístico',
        'Selección sin control de probabilidades: cada elemento no tiene una probabilidad conocida de ser elegido',
        [
          'Muestra por conveniencia: se eligen los elementos más accesibles (Ej: encuestas en calles).',
          'Muestra intencional: se buscan elementos que ayudan a responder la pregunta de investigación.',
          'Muestra por cuota: se intenta reproducir las características de la población a través de una cuota asignada.',
          'Ventaja: es barato y práctico, pero introduce sesgos inherentes; los resultados no son generalizables.',
        ],
      )}

      {theoryCard(
        'Estimación puntual',
        'Uso de estadísticos para aproximar parámetros',
        [
          'La media poblacional µ se estima con X̄ (estimación insesgada).',
          'La proporción poblacional p se estima con p̂ = x/n, donde x es el número de éxitos.',
          'El error de estimación se cuantifica mediante el error estándar de los estadísticos.',
        ],
        'µ̂ = X̄, p̂ = x/n',
      )}

      {theoryCard(
        'Tamaño de muestra',
        'Número de observaciones necesarias para obtener una estimación precisa',
        [
          'Necesario previamente: σ o estimación s, margen de error deseado e y nivel de confianza.',
          'Fórmula básica: n₀ = (z_{α/2}·σ/e)².',
          'Para proporciones: n = z²·p(1−p)/e², donde p̂ = 0.5 se usa cuando se desconoce p.',
          'Población finita N: n = n₀/(1 + (n₀−1)/N).',
          'Regla práctica: a mayor nivel de confianza, mayor n; a mayor margen de error, menor n.',
        ],
        'n₀ = (z_{α/2}·σ/e)², n = z²·p(1−p)/e²',
      )}

      <div className="flex flex-col gap-6">
        <SectionTitle title="Calculadoras de esta unidad" subtitle="Tamaños de muestra, estimadores y errores estándar" />
        <TamanoMuestraMediaCalc />
        <TamanoMuestraProporcionCalc />
        <EstimacionMediaCalc />
        <EstimacionProporcionCalc />
        <ErrorEstandarCalc />
      </div>
    </div>
  )
}
