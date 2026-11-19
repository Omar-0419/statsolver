import { describe, expect, it } from 'vitest'
import {
  betaIncReg,
  binomialCdf,
  binomialPmf,
  chi2Quantile,
  chi2SF,
  gamma,
  lgamma,
  normalCDF,
  normalQuantile,
  poissonCdf,
  poissonPmf,
  regGammaP,
  regGammaQ,
  tCDF,
  tQuantile,
} from '../special-functions'

describe('funciones especiales', () => {
  it('lgamma y gamma (Lanczos)', () => {
    expect(lgamma(5)).toBeCloseTo(3.1780538303479458, 10)
    expect(lgamma(0.5)).toBeCloseTo(0.5723649429247001, 10)
    expect(gamma(5)).toBeCloseTo(24, 8)
  })

  it('normal: PDF/CDF/cuantiles', () => {
    expect(normalCDF(0)).toBeCloseTo(0.5, 10)
    expect(normalCDF(1.96)).toBeCloseTo(0.9750021048517795, 8)
    expect(normalCDF(-1.28)).toBeCloseTo(0.1002726, 5)
    expect(normalQuantile(0.975)).toBeCloseTo(1.959963984540054, 6)
  })

  it('gamma regularizado: series y fracción continua', () => {
    expect(regGammaP(0.5, 2)).toBeCloseTo(0.9544997361036416, 8)
    expect(regGammaQ(0.5, 2)).toBeCloseTo(0.0455002638963584, 8)
    expect(regGammaP(3, 5)).toBeCloseTo(0.8753479805169191, 8)
  })

  it('beta regularizada', () => {
    expect(betaIncReg(0.5, 2, 3)).toBeCloseTo(0.6875, 10)
  })

  it('t de Student', () => {
    expect(tCDF(0, 10)).toBeCloseTo(0.5, 10)
    expect(tCDF(2.2281388519649385, 10)).toBeCloseTo(0.975, 5)
    expect(tQuantile(0.975, 10)).toBeCloseTo(2.2281388519649385, 3)
    expect(tQuantile(0.975, 24)).toBeCloseTo(2.0638985616280407, 3)
  })

  it('chi-cuadrado', () => {
    expect(chi2SF(3.841458820694124, 1)).toBeCloseTo(0.05, 4)
    expect(chi2Quantile(0.95, 1)).toBeCloseTo(3.841458820694124, 2)
  })

  it('binomial', () => {
    expect(binomialPmf(0, 4, 0.5)).toBeCloseTo(0.0625, 12)
    expect(binomialPmf(2, 4, 0.5)).toBeCloseTo(0.375, 12)
    expect(binomialPmf(3, 4, 0.5)).toBeCloseTo(0.25, 12)
    expect(binomialCdf(0, 4, 0.5)).toBeCloseTo(0.0625, 12)
    expect(binomialCdf(2, 4, 0.5)).toBeCloseTo(0.6875, 8)
  })

  it('poisson', () => {
    expect(poissonPmf(0, 2)).toBeCloseTo(0.1353352832, 8)
    expect(poissonPmf(3, 2)).toBeCloseTo(0.180447044, 7)
    expect(poissonCdf(3, 2)).toBeCloseTo(0.8571234, 5)
  })
})
