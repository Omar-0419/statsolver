export type Alternative = 'dos' | 'menor' | 'mayor'

export interface IntervalResult {
  /** Estadístico puntual (ej. media, proporción, diferencia) */
  statistic: number
  /** Error estándar del estadístico */
  standardError: number
  /** Valor crítico del nivel de confianza */
  critical: number
  /** Margen de error */
  margin: number
  lower: number
  upper: number
  /** Fórmula aplicada */
  formula: string
}

export interface HypothesisResult {
  statistic: number
  critical?: number
  pValue: number
  decision: 'rechazo_H0' | 'acepto_H0'
  interpretation: string
}

export interface SampleSizeResult {
  n: number
  n0?: number
}

export interface PointEstimation {
  estimator: string
  value: number
  proportion?: number
  total?: number
}
