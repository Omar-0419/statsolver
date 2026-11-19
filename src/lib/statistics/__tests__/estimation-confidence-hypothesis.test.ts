import { describe, expect, it } from 'vitest'
import { confidenceZ } from '../estimation'
import { ciMeanKnownSigma, ciMeanUnknownSigma, ciProportion } from '../confidence-intervals'
import {
  chi2GoodnessFit,
  chi2Independence,
  diffMeansTest,
  diffProportionsTest,
  tTestMean,
  zTestMean,
  zTestProportion,
} from '../hypothesis-testing'
import { sampleSizeMean, sampleSizeProportion } from '../estimation'
import { samplingMeanZ } from '../distributions'

describe('estimación: tamaño de muestra y error estándar', () => {
  it('tamaño de muestra para media', () => {
    expect(sampleSizeMean(2, 0.5, 0.95).n).toBe(62)
    expect(sampleSizeMean(1, 0.1, 0.95).n).toBe(385)
  })

  it('tamaño de muestra para proporción', () => {
    expect(sampleSizeProportion(0.5, 0.05, 0.95).n).toBe(385)
    expect(sampleSizeProportion(0.25, 0.05, 0.95).n).toBe(289)
  })

  it('z de la distribución muestral de la media', () => {
    expect(samplingMeanZ(11, 10, 2, 36)).toBeCloseTo(3, 10)
  })

  it('nivel de confianza → valor z crítico', () => {
    expect(confidenceZ(0.95)).toBeCloseTo(1.959963984540054, 6)
    expect(confidenceZ(0.99)).toBeCloseTo(2.5758293035489, 5)
  })
})

describe('intervalos de confianza', () => {
  it('media con desviación poblacional conocida', () => {
    const ic = ciMeanKnownSigma({ xbar: 10, sigma: 2, n: 36, confidence: 0.95 })
    expect(ic.lower).toBeCloseTo(9.346679, 4)
    expect(ic.upper).toBeCloseTo(10.653321, 4)
    expect(ic.margin).toBeCloseTo(0.653321, 4)
    expect(ic.statistic).toBe(10)
  })

  it('media con desviación muestral desconocida (t de Student)', () => {
    const ic = ciMeanUnknownSigma({ xbar: 10, s: 2.5, n: 25, confidence: 0.95 })
    expect(ic.lower).toBeCloseTo(8.968051, 4)
    expect(ic.upper).toBeCloseTo(11.031949, 4)
  })

  it('proporción', () => {
    const ic = ciProportion({ pHat: 0.4, n: 100, confidence: 0.95 })
    expect(ic.lower).toBeCloseTo(0.3039818, 4)
    expect(ic.upper).toBeCloseTo(0.4960182, 4)
  })
})

describe('pruebas de hipótesis', () => {
  it('z para una media (bilateral) → rechazo de H0', () => {
    const r = zTestMean({ xbar: 10.5, mu0: 10, sigma: 2, n: 36, alpha: 0.05, alternative: 'dos' })
    expect(r.statistic).toBeCloseTo(1.5, 8)
    expect(r.pValue).toBeGreaterThan(0.10)
    expect(r.decision).toBe('acepto_H0')
  })

  it('t para una media (bilateral) → aceptación de H0', () => {
    const r = tTestMean({ xbar: 9.5, mu0: 10, s: 2.5, n: 25, alpha: 0.05, alternative: 'dos' })
    expect(r.statistic).toBeCloseTo(-1, 8)
    expect(r.pValue).toBeGreaterThan(0.25)
    expect(r.decision).toBe('acepto_H0')
  })

  it('z para una proporción (bilateral) → aceptación de H0', () => {
    const r = zTestProportion({ pHat: 0.45, p0: 0.4, n: 200, alpha: 0.05, alternative: 'dos' })
    expect(r.statistic).toBeGreaterThan(1.4)
    expect(r.decision).toBe('acepto_H0')
  })

  it('diferencia de medias (z conocida) → rechazo de H0', () => {
    const r = diffMeansTest({
      x1: 5, s1: 2, n1: 30, x2: 3, s2: 2, n2: 30,
      alpha: 0.05, alternative: 'dos', sigmaKnown: true,
    })
    expect(r.statistic).toBeCloseTo(2, 4)
    expect(r.pValue).toBeLessThan(0.001)
    expect(r.decision).toBe('rechazo_H0')
  })

  it('diferencia de proporciones → aceptación de H0', () => {
    const r = diffProportionsTest({ p1: 0.52, n1: 500, p2: 0.48, n2: 500, alpha: 0.05, alternative: 'dos' })
    expect(r.statistic).toBeCloseTo(0.04, 4)
    expect(r.decision).toBe('acepto_H0')
  })

  it('chi-cuadrado de independencia: variables dependientes → rechazo de H0', () => {
    const r = chi2Independence([[5, 10], [10, 5]])
    expect(r.statistic).toBeCloseTo(3.33333, 4)
    expect(r.decision).toBe('acepto_H0')
  })

  it('chi-cuadrado de bondad de ajuste: frecuencias extremas → rechazo de H0', () => {
    const r = chi2GoodnessFit({ observed: [10, 20, 30, 40], expected: [20, 20, 20, 20] })
    expect(r.statistic).toBeCloseTo(30, 3)
    expect(r.decision).toBe('rechazo_H0')
  })
})
