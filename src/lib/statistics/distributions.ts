// Distribuciones asociadas a las variables aleatorias fundamentales y
// distribuciones de muestreo (media y proporción de la muestra).

import {
  binomialCdf,
  binomialPmf,
  normalCDF,
  normalPDF,
  normalQuantile,
  poissonCdf,
  poissonPmf,
} from './special-functions'

/** Distribución normal: PDF y CDF */
export function distNormal(x: number, mu = 0, sigma = 1): { pdf: number; cdf: number } {
  const z = (x - mu) / sigma
  return { pdf: normalPDF(z) / sigma, cdf: normalCDF(z) }
}

export function normalQuantileDist(p: number, mu = 0, sigma = 1): number {
  return mu + normalQuantile(p) * sigma
}

/** Distribución binomial */
export function binomialDist(k: number, n: number, p: number): { pmf: number; cdf: number; mean: number; variance: number } {
  return {
    pmf: binomialPmf(k, n, p),
    cdf: binomialCdf(k, n, p),
    mean: n * p,
    variance: n * p * (1 - p),
  }
}

/** Distribución de Poisson */
export function poissonDist(k: number, lambda: number): { pmf: number; cdf: number; mean: number; variance: number } {
  return {
    pmf: poissonPmf(k, lambda),
    cdf: poissonCdf(k, lambda),
    mean: lambda,
    variance: lambda,
  }
}

/**
 * Distribución muestral de la media: bajo el Teorema del Límite Central
 * el estadístico Z = (X̄ − µ) / (σ/√n) sigue aproximadamente N(0, 1).
 */
export function samplingMeanZ(xbar: number, mu: number, sigma: number, n: number): number {
  return (xbar - mu) / (sigma / Math.sqrt(n))
}

export function samplingMeanProb(xbar: number, mu: number, sigma: number, n: number, tail: 'lower' | 'upper'): number {
  const z = samplingMeanZ(xbar, mu, sigma, n)
  return tail === 'lower' ? normalCDF(z) : 1 - normalCDF(z) // P(X̄ ≤ xbar) / P(X̄ > xbar)
}

export function samplingMeanQuantile(p: number, mu: number, sigma: number, n: number): number {
  return mu + normalQuantile(p) * (sigma / Math.sqrt(n))
}

/** Distribución muestral de la proporción: Z = (p̂ − p) / √[p(1−p)/n] */
export function samplingProportionZ(pHat: number, p0: number, n: number): number {
  return (pHat - p0) / Math.sqrt((p0 * (1 - p0)) / n)
}

export function samplingProportionProb(pHat: number, p0: number, n: number, tail: 'lower' | 'upper'): number {
  const z = samplingProportionZ(pHat, p0, n)
  return tail === 'lower' ? normalCDF(z) : 1 - normalCDF(z)
}

export function samplingProportionQuantile(p: number, p0: number, n: number): number {
  return p0 + normalQuantile(p) * Math.sqrt((p0 * (1 - p0)) / n)
}
