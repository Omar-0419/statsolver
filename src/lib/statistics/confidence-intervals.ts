import { tQuantile } from './special-functions'
import {
  confidenceZ,
  seDifferenceMean,
  seMean,
  seProportion,
  seSampleMean,
} from './estimation'
import type { IntervalResult } from './types'

export function ciMeanKnownSigma(params: { xbar: number; sigma: number; n: number; confidence: number }): IntervalResult {
  const { xbar, sigma, n, confidence } = params
  const se = seMean(sigma, n)
  const z = confidenceZ(confidence)
  const margin = z * se
  return {
    statistic: xbar,
    standardError: se,
    critical: z,
    margin,
    lower: xbar - margin,
    upper: xbar + margin,
    formula: 'x̄ ± z·(σ/√n)',
  }
}

export function ciMeanUnknownSigma(params: { xbar: number; s: number; n: number; confidence: number }): IntervalResult {
  const { xbar, s, n, confidence } = params
  const se = seSampleMean(s, n)
  const t = tQuantile(1 - (1 - confidence) / 2, n - 1)
  const margin = t * se
  return {
    statistic: xbar,
    standardError: se,
    critical: t,
    margin,
    lower: xbar - margin,
    upper: xbar + margin,
    formula: 'x̄ ± t_{α/2, n−1}·(s/√n)',
  }
}

export function ciProportion(params: { pHat: number; n: number; confidence: number }): IntervalResult {
  const { pHat, n, confidence } = params
  const se = seProportion(pHat, n)
  const z = confidenceZ(confidence)
  const margin = z * se
  return {
    statistic: pHat,
    standardError: se,
    critical: z,
    margin,
    lower: pHat - margin,
    upper: pHat + margin,
    formula: 'p̂ ± z·√[p̂(1−p̂)/n]',
  }
}

export function ciDifferenceMeans(params: {
  x1: number
  s1: number
  n1: number
  x2: number
  s2: number
  n2: number
  confidence: number
  sigmaKnown: boolean
}): IntervalResult {
  const { x1, s1, n1, x2, s2, n2, confidence, sigmaKnown } = params
  const statistic = x1 - x2
  const se = seDifferenceMean(s1, n1, s2, n2)

  if (sigmaKnown) {
    const z = confidenceZ(confidence)
    const margin = z * se
    return {
      statistic,
      standardError: se,
      critical: z,
      margin,
      lower: statistic - margin,
      upper: statistic + margin,
      formula: 'x̄₁ − x̄₂ ± z·√[s₁²/n₁ + s₂²/n₂]',
    }
  }

  const v1 = (s1 * s1) / n1
  const v2 = (s2 * s2) / n2
  const df = ((v1 + v2) ** 2) / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1))
  const t = tQuantile(1 - (1 - confidence) / 2, df)
  const margin = t * se
  return {
    statistic,
    standardError: se,
    critical: t,
    margin,
    lower: statistic - margin,
    upper: statistic + margin,
    formula: 'x̄₁ − x̄₂ ± t_{α/2, gl}·√[s₁²/n₁ + s₂²/n₂] (Welch)',
  }
}

export function ciDifferenceProportions(params: {
  p1: number
  n1: number
  p2: number
  n2: number
  confidence: number
}): IntervalResult {
  const { p1, n1, p2, n2, confidence } = params
  const x1 = p1 * n1
  const x2 = p2 * n2
  const pHat = (x1 + x2) / (n1 + n2)
  const se = Math.sqrt(pHat * (1 - pHat) * (1 / n1 + 1 / n2))
  const z = confidenceZ(confidence)
  const margin = z * se
  const statistic = p1 - p2
  return {
    statistic,
    standardError: se,
    critical: z,
    margin,
    lower: statistic - margin,
    upper: statistic + margin,
    formula: 'p̂₁ − p̂₂ ± z·√[p̂(1−p̂)(1/n₁ + 1/n₂)]',
  }
}
