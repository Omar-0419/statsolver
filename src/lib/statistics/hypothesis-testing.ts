import {
  chi2Quantile,
  chi2SF,
  normalCDF,
  normalQuantile,
  tCDF,
  tQuantile,
} from './special-functions'
import type { Alternative, HypothesisResult } from './types'
import { formatNumber } from './formatting'

function criticalValueZ(alpha: number, alternative: Alternative): number {
  switch (alternative) {
    case 'dos':
      return normalQuantile(1 - alpha / 2)
    case 'menor':
      return -normalQuantile(1 - alpha)
    case 'mayor':
      return normalQuantile(1 - alpha)
  }
}

function criticalValueT(alpha: number, alternative: Alternative, df: number): number {
  switch (alternative) {
    case 'dos':
      return tQuantile(1 - alpha / 2, df)
    case 'menor':
      return -tQuantile(1 - alpha, df)
    case 'mayor':
      return tQuantile(1 - alpha, df)
  }
}

function decide(z: number, critical: number, alternative: Alternative): 'rechazo_H0' | 'acepto_H0' {
  if (alternative === 'dos') return Math.abs(z) > Math.abs(critical) ? 'rechazo_H0' : 'acepto_H0'
  if (alternative === 'menor') return z < critical ? 'rechazo_H0' : 'acepto_H0'
  return z > critical ? 'rechazo_H0' : 'acepto_H0'
}

function pValueNormal(z: number, alternative: Alternative): number {
  if (alternative === 'dos') return 2 * (1 - normalCDF(Math.abs(z)))
  if (alternative === 'menor') return normalCDF(z)
  return 1 - normalCDF(z)
}

function pValueT(t: number, alternative: Alternative, df: number): number {
  if (alternative === 'dos') return 2 * (1 - tCDF(Math.abs(t), df))
  if (alternative === 'menor') return tCDF(t, df)
  return 1 - tCDF(t, df)
}

function interpretDecision(d: 'rechazo_H0' | 'acepto_H0'): string {
  return d === 'rechazo_H0'
    ? 'Se rechaza la hipótesis nula H₀ al nivel de significancia α.'
    : 'No hay evidencia para rechazar la hipótesis nula H₀ al nivel de significancia α.'
}

function interpretValueP(p: number): string {
  if (p < 0.0001) return `El valor p (≈ ${formatNumber(p, 6)}) es menor que 0.0001.`
  return `El valor p es ${formatNumber(p, 4)}.`
}

export interface ZTestMeanParams {
  xbar: number
  mu0: number
  sigma: number
  n: number
  alpha: number
  alternative: Alternative
}

export function zTestMean({ xbar, mu0, sigma, n, alpha, alternative }: ZTestMeanParams): HypothesisResult {
  const z = (xbar - mu0) / (sigma / Math.sqrt(n))
  const critical = criticalValueZ(alpha, alternative)
  const p = pValueNormal(z, alternative)
  const decision = decide(z, critical, alternative)
  const h0 = alternative === 'dos' ? 'µ = µ₀' : alternative === 'menor' ? 'µ ≥ µ₀' : 'µ ≤ µ₀'
  return {
    statistic: z,
    critical,
    pValue: p,
    decision,
    interpretation: `Hipótesis nula H₀: ${h0} (µ₀ = ${formatNumber(mu0, 4)}). Estadístico de prueba z = ${formatNumber(z, 4)}. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export interface TTestMeanParams {
  xbar: number
  mu0: number
  s: number
  n: number
  alpha: number
  alternative: Alternative
}

export function tTestMean({ xbar, mu0, s, n, alpha, alternative }: TTestMeanParams): HypothesisResult {
  const df = n - 1
  const t = (xbar - mu0) / (s / Math.sqrt(n))
  const critical = criticalValueT(alpha, alternative, df)
  const p = pValueT(t, alternative, df)
  const decision = decide(t, critical, alternative)
  const h0 = alternative === 'dos' ? 'µ = µ₀' : alternative === 'menor' ? 'µ ≥ µ₀' : 'µ ≤ µ₀'
  return {
    statistic: t,
    critical,
    pValue: p,
    decision,
    interpretation: `Hipótesis nula H₀: ${h0} (µ₀ = ${formatNumber(mu0, 4)}). Estadístico de prueba t = ${formatNumber(t, 4)} con ${df} grados de libertad. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export interface ZTestProportionParams {
  pHat: number
  p0: number
  n: number
  alpha: number
  alternative: Alternative
}

export function zTestProportion({ pHat, p0, n, alpha, alternative }: ZTestProportionParams): HypothesisResult {
  const z = (pHat - p0) / Math.sqrt((p0 * (1 - p0)) / n)
  const critical = criticalValueZ(alpha, alternative)
  const p = pValueNormal(z, alternative)
  const decision = decide(z, critical, alternative)
  const h0 = alternative === 'dos' ? 'p = p₀' : alternative === 'menor' ? 'p ≥ p₀' : 'p ≤ p₀'
  return {
    statistic: z,
    critical,
    pValue: p,
    decision,
    interpretation: `Hipótesis nula H₀: ${h0} (p₀ = ${formatNumber(p0, 4)}). Estadístico de prueba z = ${formatNumber(z, 4)}. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export interface DiffMeansTestParams {
  x1: number
  s1: number
  n1: number
  x2: number
  s2: number
  n2: number
  alpha: number
  alternative: Alternative
  sigmaKnown?: boolean
}

export function diffMeansTest(params: DiffMeansTestParams): HypothesisResult {
  const { x1, s1, n1, x2, s2, n2, alpha, alternative, sigmaKnown = true } = params
  const statistic = x1 - x2
  const se = Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2)
  const z = statistic / se

  let critical: number
  let df = 0
  let p: number
  let label: string

  if (sigmaKnown) {
    critical = criticalValueZ(alpha, alternative)
    p = pValueNormal(z, alternative)
    label = 'z'
  } else {
    const v1 = (s1 * s1) / n1
    const v2 = (s2 * s2) / n2
    df = ((v1 + v2) ** 2) / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1))
    critical = criticalValueT(alpha, alternative, df)
    p = pValueT(z, alternative, df)
    label = 't (Welch)'
  }

  const decision = decide(z, critical, alternative)
  const h0 = alternative === 'dos' ? 'µ₁ = µ₂' : alternative === 'menor' ? 'µ₁ ≥ µ₂' : 'µ₁ ≤ µ₂'
  return {
    statistic,
    critical,
    pValue: p,
    decision,
    interpretation: `Hipótesis nula H₀: ${h0}. Estadístico de prueba ${label} = ${formatNumber(z, 4)}${df ? ` con ${Math.max(0, Math.round(df))} grados de libertad` : ''}. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export interface DiffProportionsTestParams {
  p1: number
  n1: number
  p2: number
  n2: number
  alpha: number
  alternative: Alternative
}

export function diffProportionsTest({ p1, n1, p2, n2, alpha, alternative }: DiffProportionsTestParams): HypothesisResult {
  const statistic = p1 - p2
  const pHat = (p1 * n1 + p2 * n2) / (n1 + n2)
  const se = Math.sqrt((pHat * (1 - pHat)) * (1 / n1 + 1 / n2))
  const z = statistic / se
  const critical = criticalValueZ(alpha, alternative)
  const p = pValueNormal(z, alternative)
  const decision = decide(z, critical, alternative)
  const h0 = alternative === 'dos' ? 'p₁ = p₂' : alternative === 'menor' ? 'p₁ ≥ p₂' : 'p₁ ≤ p₂'
  return {
    statistic,
    critical,
    pValue: p,
    decision,
    interpretation: `Hipótesis nula H₀: ${h0} (proporciones agrupadas). Estadístico de prueba z = ${formatNumber(z, 4)}. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export function chi2Independence(table: number[][], alpha = 0.05): HypothesisResult {
  const rows = table.length
  const cols = table[0]?.length ?? 0
  const rowTotals = table.map((r) => r.reduce((a, b) => a + b, 0))
  const colTotals = Array.from({ length: cols }, (_, j) => table.reduce((a, r) => a + (r[j] ?? 0), 0))
  const total = rowTotals.reduce((a, b) => a + b, 0)
  let chi2 = 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const observed = table[i][j]
      const expected = (rowTotals[i] * colTotals[j]) / total
      if (expected > 0) chi2 += ((observed - expected) ** 2) / expected
    }
  }
  const df = Math.max(0, (rows - 1) * (cols - 1))
  const p = chi2SF(chi2, df)
  const critical = chi2Quantile(1 - alpha, df)
  const decision: 'rechazo_H0' | 'acepto_H0' = chi2 > critical ? 'rechazo_H0' : 'acepto_H0'
  return {
    statistic: chi2,
    critical,
    pValue: p,
    decision,
    interpretation: `Se prueba la independencia de las variables categóricas. Estadístico χ² = ${formatNumber(chi2, 4)} con ${df} grados de libertad. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}

export function chi2GoodnessFit(params: {
  observed: number[]
  expected: number[]
  alpha?: number
  df?: number
}): HypothesisResult {
  const { observed, expected, alpha = 0.05 } = params
  const df = params.df ?? Math.max(0, observed.length - 1)
  let chi2 = 0
  for (let i = 0; i < observed.length; i++) {
    const e = expected[i] ?? 0
    if (e > 0) chi2 += ((observed[i] - e) ** 2) / e
  }
  const p = chi2SF(chi2, df)
  const critical = chi2Quantile(1 - alpha, df)
  const decision: 'rechazo_H0' | 'acepto_H0' = chi2 > critical ? 'rechazo_H0' : 'acepto_H0'
  return {
    statistic: chi2,
    critical,
    pValue: p,
    decision,
    interpretation: `Se prueba la bondad de ajuste de los datos observados a los esperados. Estadístico χ² = ${formatNumber(chi2, 4)} con ${df} grados de libertad. ${interpretValueP(p)} ${interpretDecision(decision)}`,
  }
}
