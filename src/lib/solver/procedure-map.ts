import type { ComponentType } from 'react'
import {
  ProbNormalCalc,
  ProbBinomialCalc,
  ProbPoissonCalc,
  DistMuestralMediaCalc,
  DistMuestralProporcionCalc,
} from '@/components/calculators/distributions'
import {
  TamanoMuestraMediaCalc,
  TamanoMuestraProporcionCalc,
  EstimacionMediaCalc,
  EstimacionProporcionCalc,
  ErrorEstandarCalc,
} from '@/components/calculators/estimation'
import {
  CIMediaZCalc,
  CIMediaTcalc,
  CIproporcionCalc,
  CIdifMediasCalc,
  CIdifProporcionesCalc,
} from '@/components/calculators/confidence'
import {
  PruebaZMediaCalc,
  PruebaTMediaCalc,
  PruebaZProporcionCalc,
  PruebaDifMediasCalc,
  PruebaDifProporcionesCalc,
  Chi2IndependenciaCalc,
  Chi2BondadAjusteCalc,
} from '@/components/calculators/hypothesis'

export interface ProcedureDef {
  id: string
  name: string
  description: string
  unit: number
  formula?: string
  component: ComponentType
}

/** Catálogo de procedimientos que el solucionador puede ejecutar */
export const PROCEDURES: ProcedureDef[] = [
  { id: 'normal', name: 'Probabilidad de la distribución normal', description: 'Calcula la probabilidad de que X ~ N(µ, σ²) tome valores en un intervalo o cola.', unit: 1, formula: 'P(X ≤ x) = Φ((x−µ)/σ)', component: ProbNormalCalc },
  { id: 'binomial', name: 'Probabilidad binomial', description: 'Calcula la probabilidad puntual y acumulada de una variable binomial.', unit: 1, formula: 'P(X = k) = C(n,k)·p^k·(1−p)^(n−k)', component: ProbBinomialCalc },
  { id: 'poisson', name: 'Probabilidad de Poisson', description: 'Calcula la probabilidad puntual y acumulada de una variable de Poisson.', unit: 1, formula: 'P(X = k) = (λ^k·e^(−λ))/k!', component: ProbPoissonCalc },
  { id: 'media_muestral', name: 'Distribución muestral de la media', description: 'Calcula el estadístico Z y la probabilidad asociada a una media muestral.', unit: 1, formula: 'Z = (X̄ − µ)/(σ/√n)', component: DistMuestralMediaCalc },
  { id: 'proporcion_muestral', name: 'Distribución muestral de la proporción', description: 'Calcula el estadístico Z y la probabilidad asociada a una proporción muestral.', unit: 1, formula: 'Z = (p̂ − p)/√[p(1−p)/n]', component: DistMuestralProporcionCalc },
  { id: 'tamaño_media', name: 'Tamaño de muestra para estimar una media', description: 'Calcula el tamaño de muestra necesario para estimar una media con un margen de error.', unit: 2, formula: 'n₀ = (z_{α/2}·σ/e)²', component: TamanoMuestraMediaCalc },
  { id: 'tamaño_proporcion', name: 'Tamaño de muestra para estimar una proporción', description: 'Calcula el tamaño de muestra necesario para estimar una proporción con un margen de error.', unit: 2, formula: 'n = z²·p(1−p)/e²', component: TamanoMuestraProporcionCalc },
  { id: 'estim_media', name: 'Estimación de la media', description: 'Calcula la estimación puntual del promedio poblacional y su error estándar.', unit: 2, formula: 'X̄, SE = s/√n', component: EstimacionMediaCalc },
  { id: 'estim_proporcion', name: 'Estimación de la proporción', description: 'Calcula la estimación puntual de una proporción poblacional.', unit: 2, formula: 'p̂ = x/n, SE = √[p̂(1−p̂)/n]', component: EstimacionProporcionCalc },
  { id: 'error_estandar', name: 'Cálculo del error estándar', description: 'Calcula el error estándar de una media o proporción.', unit: 2, formula: 'SE = σ/√n o SE = √[p(1−p)/n]', component: ErrorEstandarCalc },
  { id: 'ci_media_z', name: 'Intervalo de confianza para una media (Z)', description: 'Intervalo para la media con desviación poblacional conocida.', unit: 3, formula: 'X̄ ± z·(σ/√n)', component: CIMediaZCalc },
  { id: 'ci_media_t', name: 'Intervalo de confianza para una media (T)', description: 'Intervalo para la media con desviación muestral desconocida (T de Student).', unit: 3, formula: 'X̄ ± t·(s/√n)', component: CIMediaTcalc },
  { id: 'ci_proporcion', name: 'Intervalo de confianza para una proporción', description: 'Intervalo para una proporción poblacional.', unit: 3, formula: 'p̂ ± z·√[p̂(1−p̂)/n]', component: CIproporcionCalc },
  { id: 'ci_dif_med', name: 'Intervalo de confianza para diferencia de medias', description: 'Intervalo para la diferencia entre dos medias (Welch o varianzas conocidas).', unit: 3, formula: '(X̄₁ − X̄₂) ± t·√[s₁²/n₁ + s₂²/n₂]', component: CIdifMediasCalc },
  { id: 'ci_dif_prop', name: 'Intervalo de confianza para diferencia de proporciones', description: 'Intervalo para la diferencia entre dos proporciones.', unit: 3, formula: '(p̂₁ − p̂₂) ± z·√[p̂(1−p̂)(1/n₁ + 1/n₂)]', component: CIdifProporcionesCalc },
  { id: 'prueba_z_media', name: 'Prueba Z para una media', description: 'Prueba de hipótesis para la media con desviación poblacional conocida.', unit: 4, formula: 'z = (X̄ − µ₀)/(σ/√n)', component: PruebaZMediaCalc },
  { id: 'prueba_t_media', name: 'Prueba T para una media', description: 'Prueba de hipótesis para la media con desviación muestral desconocida.', unit: 4, formula: 't = (X̄ − µ₀)/(s/√n)', component: PruebaTMediaCalc },
  { id: 'prueba_z_prop', name: 'Prueba Z para una proporción', description: 'Prueba de hipótesis para una proporción poblacional.', unit: 4, formula: 'z = (p̂ − p₀)/√[p₀(1−p₀)/n]', component: PruebaZProporcionCalc },
  { id: 'prueba_dif_med', name: 'Prueba para diferencia de medias', description: 'Prueba de hipótesis para la diferencia entre dos medias.', unit: 4, formula: 'z/t = (X̄₁ − X̄₂)/√[s₁²/n₁ + s₂²/n₂]', component: PruebaDifMediasCalc },
  { id: 'prueba_dif_prop', name: 'Prueba para diferencia de proporciones', description: 'Prueba de hipótesis para la diferencia entre dos proporciones.', unit: 4, formula: 'z = (p̂₁ − p̂₂)/SE', component: PruebaDifProporcionesCalc },
  { id: 'chi2_indep', name: 'Prueba Chi-cuadrado de independencia', description: 'Prueba de independencia para tablas de contingencia 2×2.', unit: 4, formula: 'χ² = Σ[(O − E)²/E], E = (Fila × Columna)/Total', component: Chi2IndependenciaCalc },
  { id: 'chi2_ajuste', name: 'Prueba Chi-cuadrado de bondad de ajuste', description: 'Comprueba si una distribución observada se ajusta a una esperada.', unit: 4, formula: 'χ² = Σ[(O − E)²/E]', component: Chi2BondadAjusteCalc },
]

export function getProcedure(id: string): ProcedureDef | undefined {
  return PROCEDURES.find((p) => p.id === id)
}

export function proceduresByUnit(unit: number): ProcedureDef[] {
  return PROCEDURES.filter((p) => p.unit === unit)
}
