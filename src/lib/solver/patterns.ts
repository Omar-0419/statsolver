// Reconocimiento de patrones local (sin inteligencia artificial):
// reglas estáticas en español sobre el texto introducido del enunciado.

export interface StatementAnalysis {
  numbers: number[]
  detectedTerms: string[]
  units: number[]
  unit?: number
  suggestedProcedureId?: string
  suggestedProcedure?: string
  confidence: number
  summary: string
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Extrae números (con posible separador decimal en comma) del texto */
export function extractNumbers(statement: string): number[] {
  const raw = statement.match(/-?\d+(?:[.,]\d+)?/g) ?? []
  return raw.map((m) => parseFloat(m.replace(',', '.')))
}

interface KeywordRule {
  term: string
  label: string
  unit?: number
}

const KEYWORDS: KeywordRule[] = [
  { term: 'distribución muestral de la media', label: 'distribución muestral de la media', unit: 1 },
  { term: 'distribución muestral de la proporción', label: 'distribución muestral de la proporción', unit: 1 },
  { term: 'teorema del límite central', label: 'teorema del límite central (TLC)', unit: 1 },
  { term: 'distribución de poisson', label: 'distribución de Poisson', unit: 1 },
  { term: 'distribución binomial', label: 'distribución binomial', unit: 1 },
  { term: 'distribución normal', label: 'distribución normal', unit: 1 },
  { term: 'error estándar', label: 'error estándar', unit: 1 },
  { term: 'tamaño de muestra', label: 'tamaño de muestra', unit: 2 },
  { term: 'muestreo probabilístico', label: 'muestreo probabilístico', unit: 2 },
  { term: 'muestreo no probabilístico', label: 'muestreo no probabilístico', unit: 2 },
  { term: 'estimación puntual', label: 'estimación puntual', unit: 2 },
  { term: 'parámetro', label: 'parámetro', unit: 2 },
  { term: 'intervalo de confianza', label: 'intervalo de confianza', unit: 3 },
  { term: 'nivel de confianza', label: 'nivel de confianza', unit: 3 },
  { term: 'margen de error', label: 'margen de error', unit: 3 },
  { term: 'valor crítico', label: 'valor crítico', unit: 3 },
  { term: 'hipótesis nula', label: 'hipótesis nula', unit: 4 },
  { term: 'hipótesis alternativa', label: 'hipótesis alternativa', unit: 4 },
  { term: 'prueba de hipótesis', label: 'prueba de hipótesis', unit: 4 },
  { term: 'valor p', label: 'valor p', unit: 4 },
  { term: 'nivel de significancia', label: 'nivel de significancia', unit: 4 },
  { term: 'error tipo i', label: 'error tipo I', unit: 4 },
  { term: 'diferencia de medias', label: 'diferencia de medias', unit: 3 },
  { term: 'diferencia de proporciones', label: 'diferencia de proporciones', unit: 3 },
  { term: 'proporción', label: 'proporción', unit: 2 },
  { term: 'media', label: 'media', unit: 1 },
  { term: 'muestra', label: 'muestra', unit: 2 },
  { term: 'desviación estándar', label: 'desviación estándar', unit: 1 },
]

interface ProcedureSuggestion {
  id: string
  match: RegExp
  unit?: number
  description: string
}

const PROCEDURE_SUGGESTIONS: ProcedureSuggestion[] = [
  { id: 'chi2_indep', match: /chi-cuadrado|chi cuadrado|independencia/i, unit: 4, description: 'Prueba Chi-cuadrado de independencia' },
  { id: 'chi2_ajuste', match: /bondad de ajuste/i, unit: 4, description: 'Prueba Chi-cuadrado de bondad de ajuste' },
  { id: 'ci_dif_prop', match: /diferencia de proporciones/i, unit: 3, description: 'Intervalo de confianza para diferencia de proporciones' },
  { id: 'prueba_dif_prop', match: /diferencia de proporciones/i, unit: 4, description: 'Prueba para diferencia de proporciones' },
  { id: 'ci_dif_med', match: /diferencia de medias/i, unit: 3, description: 'Intervalo de confianza para diferencia de medias' },
  { id: 'prueba_dif_med', match: /diferencia de medias/i, unit: 4, description: 'Prueba para diferencia de medias' },
  { id: 'prueba_z_prop', match: /prueba.*proporción|hipótesis.*proporción/i, unit: 4, description: 'Prueba Z para una proporción' },
  { id: 'prueba_z_media', match: /prueba.*media|hipótesis.*media/i, unit: 4, description: 'Prueba Z para una media' },
  { id: 'ci_proporcion', match: /intervalo de confianza.*proporción|proporción.*intervalo de confianza/i, unit: 3, description: 'Intervalo de confianza para una proporción' },
  { id: 'ci_media_z', match: /intervalo de confianza.*media|media.*intervalo de confianza/i, unit: 3, description: 'Intervalo de confianza para una media (Z)' },
  { id: 'tamaño_proporcion', match: /tamaño de muestra.*proporción|proporción.*tamaño de muestra/i, unit: 2, description: 'Tamaño de muestra para proporción' },
  { id: 'tamaño_media', match: /tamaño de muestra.*media|media.*tamaño de muestra/i, unit: 2, description: 'Tamaño de muestra para media' },
  { id: 'estim_proporcion', match: /estimación de la proporción/i, unit: 2, description: 'Estimación de la proporción' },
  { id: 'estim_media', match: /estimación de la media/i, unit: 2, description: 'Estimación de la media' },
  { id: 'proporcion_muestral', match: /proporción muestral|media muestral|media de la distribución muestral/i, unit: 1, description: 'Distribución muestral de la proporción' },
  { id: 'media_muestral', match: /distribución muestral de la media/i, unit: 1, description: 'Distribución muestral de la media' },
  { id: 'poisson', match: /poisson/i, unit: 1, description: 'Probabilidad de Poisson' },
  { id: 'binomial', match: /binomial/i, unit: 1, description: 'Probabilidad binomial' },
  { id: 'normal', match: /normal/i, unit: 1, description: 'Probabilidad de la distribución normal' },
]

/**
 * Analiza un enunciado localmente:
 * - números extraídos del texto,
 * - términos estadísticos detectados,
 * - unidad(es) identificadas,
 * - procedimiento sugerido (sin afirmar que lo comprende el sistema).
 */
export function analyzeStatement(statement: string): StatementAnalysis {
  const text = normalize(statement)
  const numbers = extractNumbers(statement)

  const detectedTerms: string[] = []
  const units = new Set<number>()
  for (const kw of KEYWORDS) {
    if (text.includes(kw.term) && !detectedTerms.includes(kw.label)) {
      detectedTerms.push(kw.label)
      if (kw.unit) units.add(kw.unit)
    }
  }

  const suggestion = PROCEDURE_SUGGESTIONS.find((s) => s.match.test(text))

  let confidence = 30
  if (suggestion && numbers.length >= 1) confidence = 100
  else if (suggestion) confidence = 70
  else if (numbers.length >= 1) confidence = 50

  const unitList = Array.from(units).sort((a, b) => a - b)
  const unit = unitList[0]

  const numbersSummary = numbers.length > 0 ? numbers.join(', ') : 'ninguno detectado'
  const summary = [
    suggestion
      ? `Solicita: ${suggestion.description}.`
      : 'No se pudo identificar automáticamente el procedimiento específico.',
    unit ? `Unidad identificada: ${UNIT_NAMES[unit - 1] ?? `Unidad ${unit}`}.` : 'Unidad identificada: no clara.',
    detectedTerms.length > 0 ? `Términos detectados: ${detectedTerms.join(', ')}.` : 'Términos detectados: ninguno.',
    `Valores numéricos: ${numbersSummary}.`,
    suggestion
      ? `Confianza del ${confidence} % en la detección; verifique o seleccione el procedimiento faltante.`
      : `Confianza del ${confidence} %; seleccione el procedimiento y complete los datos.`,
  ].join(' ')

  return {
    numbers,
    detectedTerms,
    units: unitList,
    unit,
    suggestedProcedureId: suggestion?.id,
    suggestedProcedure: suggestion?.description,
    confidence,
    summary,
  }
}

export const UNIT_NAMES = [
  'Unidad 1 — Distribuciones muestrales',
  'Unidad 2 — Estimación y muestreo',
  'Unidad 3 — Intervalos de confianza',
  'Unidad 4 — Pruebas de hipótesis',
] as const
