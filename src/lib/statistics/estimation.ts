import { normalQuantile } from './special-functions'

/** Nivel de confianza para un intervalo con significancia α = 1 − confianza */
export function confidenceZ(confidence: number): number {
  return normalQuantile(1 - (1 - confidence) / 2)
}

export function seMean(sigma: number, n: number): number {
  return sigma / Math.sqrt(n)
}

export function seSampleMean(s: number, n: number): number {
  return s / Math.sqrt(n)
}

export function seProportion(p: number, n: number): number {
  return Math.sqrt((p * (1 - p)) / n)
}

export function seDifferenceMean(s1: number, n1: number, s2: number, n2: number): number {
  return Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2)
}

export function seDifferenceProportion(p1: number, n1: number, p2: number, n2: number): number {
  return Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2)
}

export interface SampleSizeResult {
  n: number
  n0?: number
}

/** Tamaño de muestra para estimar una media (σ conocida o desconocida) */
export function sampleSizeMean(sigma: number, e: number, confidence: number): SampleSizeResult {
  const z = confidenceZ(confidence)
  return { n: Math.ceil(((z * sigma) / e) ** 2) }
}

/** Tamaño de muestra para estimar una proporción (p desconocida → p = 0.5) */
export function sampleSizeProportion(p: number, e: number, confidence: number): SampleSizeResult {
  const z = confidenceZ(confidence)
  return { n: Math.ceil(((z * z * p * (1 - p)) / (e * e))) }
}

/** Tamaño de muestra para media con población finita */
export function sampleSizeMeanFinite(n0: number, N: number): SampleSizeResult {
  return { n: Math.ceil((n0 * N) / (n0 + N - 1)), n0 }
}

/** Tamaño de muestra para proporción con población finita */
export function sampleSizeProportionFinite(n0: number, N: number): SampleSizeResult {
  return { n: Math.ceil((n0 * N) / (n0 + N - 1)), n0 }
}

export interface PointEstimation {
  estimator: string
  value: number
  proportion?: number
  total?: number
}

export function pointEstimationMean(xbar: number): PointEstimation {
  return { estimator: 'X̄', value: xbar }
}

export function pointEstimationProportion(x: number, n: number): PointEstimation {
  const pHat = n > 0 ? x / n : 0
  return { estimator: 'p̂', value: pHat, proportion: pHat, total: n }
}
