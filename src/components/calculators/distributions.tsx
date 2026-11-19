'use client'

import { useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { CalculatorLayout } from '@/components/calculators/shared/CalculatorLayout'
import { StepList } from '@/components/calculators/shared/StepList'
import { binomialDist, poissonDist, samplingMeanProb, samplingMeanZ, samplingProportionProb, samplingProportionZ } from '@/lib/statistics/distributions'
import { normalCDF } from '@/lib/statistics/special-functions'
import { parseNumber } from '@/lib/statistics/validations'
import { formatNumber, formatPValue } from '@/lib/statistics/formatting'

interface CalcState {
  result?: ReactNode
  development?: ReactNode
  interpretation?: string
  resultsText?: string
}

function pnum(raw: string, label: string, opts: { positive?: boolean; integer?: boolean } = {}): { value?: number; error?: string } {
  const v = parseNumber(raw, { label, ...opts })
  return v.ok ? { value: v.value } : { error: v.error }
}

// ---------------------------------------------------------------------------
// Probabilidad de la distribución normal
// ---------------------------------------------------------------------------
interface ProbNormalForm { mu: string; sigma: string; x: string; a: string; b: string; tail: 'menor' | 'mayor' | 'entre' }
const initialProbNormalForm: ProbNormalForm = { mu: '0', sigma: '1', x: '', a: '', b: '', tail: 'menor' }

export function ProbNormalCalc() {
  const [form, setForm] = useState<ProbNormalForm>(initialProbNormalForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialProbNormalForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const muR = pnum(form.mu, 'Media poblacional (µ)')
    const sigR = pnum(form.sigma, 'Desviación poblacional (σ)', { positive: true })
    let xR: ReturnType<typeof pnum> | undefined
    let aR: ReturnType<typeof pnum> | undefined
    let bR: ReturnType<typeof pnum> | undefined
    if (form.tail === 'entre') {
      aR = pnum(form.a, 'Límite inferior (a)')
      bR = pnum(form.b, 'Límite superior (b)')
    } else {
      xR = pnum(form.x, 'Valor (X)')
    }
    const errors = [muR, sigR, xR, aR, bR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const mu = muR.value!
    const sigma = sigR.value!
    let pValue: number
    let formula = ''
    let steps: { label: string; value: string }[] = []
    let interpretation = ''

    if (form.tail === 'entre') {
      const a = aR!.value!
      const b = bR!.value!
      if (a > b) {
        setErr('El límite inferior (a) debe ser menor o igual que el límite superior (b).')
        setCalc(null)
        return
      }
      const za = (a - mu) / sigma
      const zb = (b - mu) / sigma
      const phiA = normalCDF(za)
      const phiB = normalCDF(zb)
      pValue = phiB - phiA
      formula = 'P(a ≤ X ≤ b) = Φ((b−µ)/σ) − Φ((a−µ)/σ)'
      steps = [
        { label: 'Calcular z₁ = (a − µ)/σ y z₂ = (b − µ)/σ', value: `z₁ = ${formatNumber(za, 4)}, z₂ = ${formatNumber(zb, 4)}` },
        { label: 'Calcular Φ(z₂)', value: `Φ(${formatNumber(zb, 4)}) = ${formatPValue(phiB)}` },
        { label: 'Calcular Φ(z₁)', value: `Φ(${formatNumber(za, 4)}) = ${formatPValue(phiA)}` },
        { label: 'Restar las probabilidades', value: `${formatPValue(phiB)} − ${formatPValue(phiA)} = ${formatPValue(pValue)}` },
      ]
      interpretation = `La probabilidad de que X tome un valor entre ${formatNumber(a, 4)} y ${formatNumber(b, 4)} es ${formatPValue(pValue)}. Esta se calcula a partir de la distribución normal estándar.`
    } else {
      const x = xR!.value!
      const z = (x - mu) / sigma
      const phi = normalCDF(z)
      pValue = form.tail === 'mayor' ? 1 - phi : phi
      formula = form.tail === 'mayor' ? 'P(X > x) = 1 − Φ((x−µ)/σ)' : 'P(X ≤ x) = Φ((x−µ)/σ)'
      steps = [
        { label: 'Calcular z = (x − µ)/σ', value: `z = ${formatNumber(z, 4)}` },
        { label: 'Evaluar Φ(z) en la tabla de la normal estándar', value: `Φ(${formatNumber(z, 4)}) = ${formatPValue(phi)}` },
        {
          label: 'Resultado',
          value: form.tail === 'mayor' ? `P(X > ${formatNumber(x, 4)}) = 1 − ${formatPValue(phi)} = ${formatPValue(pValue)}` : `P(X ≤ ${formatNumber(x, 4)}) = ${formatPValue(pValue)}`,
        },
      ]
      interpretation = `La probabilidad de que X ${form.tail === 'mayor' ? 'sea mayor que' : 'sea menor o igual a'} ${formatNumber(x, 4)} es ${formatPValue(pValue)}.`
    }

    const resultsText = `Probabilidad = ${formatPValue(pValue)}`
    setCalc({
      result: <StatCard label="Probabilidad" value={formatPValue(pValue)} tone="accent" />,
      development: <StepList formula={formula} steps={steps} copyText={resultsText} />,
      interpretation,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Probabilidad de la distribución normal"
      description="Calcula la probabilidad asociada a un valor de una variable aleatoria normalmente distribuida."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Media poblacional (µ)"
              value={form.mu}
              onChange={(e) => setForm((f) => ({ ...f, mu: e.target.value }))}
              help="Valor esperado de la variable aleatoria"
            />
            <Input
              label="Desviación poblacional (σ)"
              value={form.sigma}
              onChange={(e) => setForm((f) => ({ ...f, sigma: e.target.value }))}
              help="Desviación estándar de la población"
            />
            <Select
              label="Probabilidad a calcular"
              value={form.tail}
              onChange={(e) => setForm((f) => ({ ...f, tail: e.target.value as ProbNormalForm['tail'] }))}
            >
              <option value="menor">P(X ≤ x)</option>
              <option value="mayor">P(X &gt; x)</option>
              <option value="entre">Entre a y b: P(a ≤ X ≤ b)</option>
            </Select>
          </div>
          {form.tail === 'entre' ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Límite inferior (a)"
                value={form.a}
                onChange={(e) => setForm((f) => ({ ...f, a: e.target.value }))}
                help="Valor inferior del intervalo"
              />
              <Input
                label="Límite superior (b)"
                value={form.b}
                onChange={(e) => setForm((f) => ({ ...f, b: e.target.value }))}
                help="Valor superior del intervalo"
              />
            </div>
          ) : (
            <Input
              label="Valor (X)"
              value={form.x}
              onChange={(e) => setForm((f) => ({ ...f, x: e.target.value }))}
              help="Valor de la variable a evaluar"
            />
          )}
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}

// ---------------------------------------------------------------------------
// Probabilidad binomial
// ---------------------------------------------------------------------------
interface ProbBinomialForm { n: string; p: string; k: string }
const initialProbBinomialForm: ProbBinomialForm = { n: '10', p: '0.5', k: '5' }

export function ProbBinomialCalc() {
  const [form, setForm] = useState<ProbBinomialForm>(initialProbBinomialForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialProbBinomialForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const nR = pnum(form.n, 'Número de ensayos (n)', { positive: true, integer: true })
    const pR = pnum(form.p, 'Probabilidad de éxito (p)', { positive: true })
    const kR = pnum(form.k, 'Número de éxitos (k)', { positive: true, integer: true })
    const errors = [nR, pR, kR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const n = nR.value!
    const p = pR.value!
    const k = kR.value!
    const { pmf, cdf } = binomialDist(k, n, p)
    const resultsText = `P(X = ${k}) = ${formatPValue(pmf)}, P(X ≤ ${k}) = ${formatPValue(cdf)}`

    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="P(X = k)" value={formatPValue(pmf)} tone="primary" />
          <StatCard label="P(X ≤ k)" value={formatPValue(cdf)} tone="accent" />
          <StatCard label="Media" value={formatNumber(n * p, 4)} tone="muted" />
          <StatCard label="Varianza" value={formatNumber(n * p * (1 - p), 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="P(X = k) = C(n, k) · p^k · (1−p)^(n−k)"
          steps={[
            { label: 'Verificar que 0 ≤ k ≤ n', value: `k = ${k}, n = ${n}` },
            { label: 'Calcular la probabilidad puntual del evento k', value: `P(X = ${k}) = ${formatPValue(pmf)}` },
            { label: 'Calcular la probabilidad acumulada P(X ≤ k)', value: `P(X ≤ ${k}) = ${formatPValue(cdf)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Para una binomial con ${n} ensayos e intento de éxito p = ${formatNumber(p, 4)}, la probabilidad de obtener exactamente ${k} éxitos es ${formatPValue(pmf)}, y la probabilidad de obtener como máximo ${k} éxitos es ${formatPValue(cdf)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Probabilidad binomial"
      description="Calcula la probabilidad puntual y acumulada de una distribución binomial."
      form={
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Número de ensayos (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input
            label="Probabilidad de éxito (p)"
            value={form.p}
            onChange={(e) => setForm((f) => ({ ...f, p: e.target.value }))}
            help="Entre 0 y 1"
          />
          <Input
            label="Número de éxitos (k)"
            value={form.k}
            onChange={(e) => setForm((f) => ({ ...f, k: e.target.value }))}
            help="Entero entre 0 y n"
          />
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}

// ---------------------------------------------------------------------------
// Probabilidad Poisson
// ---------------------------------------------------------------------------
interface ProbPoissonForm { lambda: string; k: string }
const initialProbPoissonForm: ProbPoissonForm = { lambda: '4', k: '6' }

export function ProbPoissonCalc() {
  const [form, setForm] = useState<ProbPoissonForm>(initialProbPoissonForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialProbPoissonForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const lambdaR = pnum(form.lambda, 'Tasa de ocurrencia (λ)', { positive: true })
    const kR = pnum(form.k, 'Número de ocurrencias (k)', { positive: true, integer: true })
    const errors = [lambdaR, kR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const lambda = lambdaR.value!
    const k = kR.value!
    const { pmf, cdf } = poissonDist(k, lambda)
    const resultsText = `P(X = ${k}) = ${formatPValue(pmf)}, P(X ≤ ${k}) = ${formatPValue(cdf)}`

    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="P(X = k)" value={formatPValue(pmf)} tone="primary" />
          <StatCard label="P(X ≤ k)" value={formatPValue(cdf)} tone="accent" />
          <StatCard label="Media" value={formatNumber(lambda, 4)} tone="muted" />
          <StatCard label="Varianza" value={formatNumber(lambda, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="P(X = k) = (λ^k · e^(−λ)) / k!"
          steps={[
            { label: 'Calcular la probabilidad de k ocurrencias', value: `P(X = ${k}) = ${formatPValue(pmf)}` },
            { label: 'Calcular la probabilidad acumulada P(X ≤ k)', value: `P(X ≤ ${k}) = ${formatPValue(cdf)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Para una variable de Poisson con tasa λ = ${formatNumber(lambda, 4)}, la probabilidad de observar exactamente ${k} ocurrencias es ${formatPValue(pmf)}, y la probabilidad de observar como máximo ${k} es ${formatPValue(cdf)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Probabilidad de Poisson"
      description="Calcula la probabilidad puntual y acumulada de una distribución de Poisson."
      form={
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Tasa de ocurrencia (λ)" value={form.lambda} onChange={(e) => setForm((f) => ({ ...f, lambda: e.target.value }))} help="Valor positivo de λ" />
          <Input
            label="Número de ocurrencias (k)"
            value={form.k}
            onChange={(e) => setForm((f) => ({ ...f, k: e.target.value }))}
            help="Entero no negativo"
          />
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}

// ---------------------------------------------------------------------------
// Distribución muestral de la media
// ---------------------------------------------------------------------------
interface DistMuestralMediaForm { mu: string; sigma: string; n: string; xbar: string; tail: 'menor' | 'mayor' }
const initialDistMuestralMediaForm: DistMuestralMediaForm = { mu: '10', sigma: '2', n: '36', xbar: '11', tail: 'mayor' }

export function DistMuestralMediaCalc() {
  const [form, setForm] = useState<DistMuestralMediaForm>(initialDistMuestralMediaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialDistMuestralMediaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const muR = pnum(form.mu, 'Media poblacional (µ)')
    const sigR = pnum(form.sigma, 'Desviación poblacional (σ)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de la muestra (n)', { positive: true, integer: true })
    const xR = pnum(form.xbar, 'Media muestral (X̄)')
    const errors = [muR, sigR, nR, xR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const mu = muR.value!
    const sigma = sigR.value!
    const n = nR.value!
    const xbar = xR.value!
    const z = samplingMeanZ(xbar, mu, sigma, n)
    const se = sigma / Math.sqrt(n)
    const prob = samplingMeanProb(xbar, mu, sigma, n, form.tail === 'mayor' ? 'upper' : 'lower')

    const resultsText = `Z = ${formatNumber(z, 4)}, ${form.tail === 'mayor' ? 'P(X̄ > X̄)' : 'P(X̄ ≤ X̄)'} = ${formatPValue(prob)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Estadístico Z" value={formatNumber(z, 4)} tone="primary" />
          <StatCard label={form.tail === 'mayor' ? 'P(X̄ > X̄)' : 'P(X̄ ≤ X̄)'} value={formatPValue(prob)} tone="accent" />
          <StatCard label="Error estándar" value={formatNumber(se, 4)} tone="muted" />
          <StatCard label="Media muestral" value={formatNumber(xbar, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="Z = (X̄ − µ) / (σ/√n)"
          steps={[
            { label: 'Calcular el error estándar', value: `SE = σ/√n = ${formatNumber(sigma, 4)}/√${n} = ${formatNumber(se, 4)}` },
            { label: 'Calcular el estadístico Z', value: `Z = (${formatNumber(xbar, 4)} − ${formatNumber(mu, 4)}) / ${formatNumber(se, 4)} = ${formatNumber(z, 4)}` },
            {
              label: `Evaluar P(${form.tail === 'mayor' ? 'X̄ > X̄' : 'X̄ ≤ X̄'})`,
              value: `${form.tail === 'mayor' ? '1 − Φ(Z)' : 'Φ(Z)'} = ${formatPValue(prob)}`,
            },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Dada una media muestral de ${formatNumber(xbar, 4)} y ${n} observaciones con desviación poblacional ${formatNumber(sigma, 4)} alrededor de ${formatNumber(mu, 4)}, la probabilidad de obtener esa media ${form.tail === 'mayor' ? 'o superior' : 'o inferior'} es ${formatPValue(prob)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Probabilidad asociada a medias muestrales"
      description="Calcula el estadístico Z y la probabilidad asociada a una media muestral bajo el Teorema del Límite Central."
      form={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Media poblacional (µ)" value={form.mu} onChange={(e) => setForm((f) => ({ ...f, mu: e.target.value }))} />
          <Input label="Desviación poblacional (σ)" value={form.sigma} onChange={(e) => setForm((f) => ({ ...f, sigma: e.target.value }))} help="σ > 0" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
          <Select
            label="Probabilidad a calcular"
            value={form.tail}
            onChange={(e) => setForm((f) => ({ ...f, tail: e.target.value as DistMuestralMediaForm['tail'] }))}
          >
            <option value="menor">P(X̄ ≤ X̄)</option>
            <option value="mayor">P(X̄ &gt; X̄)</option>
          </Select>
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}

// ---------------------------------------------------------------------------
// Distribución muestral de la proporción
// ---------------------------------------------------------------------------
interface DistMuestralProporcionForm { p0: string; n: string; pHat: string; tail: 'menor' | 'mayor' }
const initialDistMuestralProporcionForm: DistMuestralProporcionForm = { p0: '0.5', n: '100', pHat: '0.55', tail: 'mayor' }

export function DistMuestralProporcionCalc() {
  const [form, setForm] = useState<DistMuestralProporcionForm>(initialDistMuestralProporcionForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialDistMuestralProporcionForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const p0R = pnum(form.p0, 'Proporción poblacional (p)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de la muestra (n)', { positive: true, integer: true })
    const pHatR = pnum(form.pHat, 'Proporción muestral (p̂)')
    const errors = [p0R, nR, pHatR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const p0 = p0R.value!
    const n = nR.value!
    const pHat = pHatR.value!
    const z = samplingProportionZ(pHat, p0, n)
    const prob = samplingProportionProb(pHat, p0, n, form.tail === 'mayor' ? 'upper' : 'lower')

    const resultsText = `Z = ${formatNumber(z, 4)}, ${form.tail === 'mayor' ? 'P(p̂ > p̂)' : 'P(p̂ ≤ p̂)'} = ${formatPValue(prob)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Estadístico Z" value={formatNumber(z, 4)} tone="primary" />
          <StatCard label={form.tail === 'mayor' ? 'P(p̂ > p̂)' : 'P(p̂ ≤ p̂)'} value={formatPValue(prob)} tone="accent" />
          <StatCard label="Error estándar" value={formatNumber(Math.sqrt((p0 * (1 - p0)) / n), 4)} tone="muted" />
          <StatCard label="Proporción muestral" value={formatNumber(pHat, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="Z = (p̂ − p) / √[p(1−p)/n]"
          steps={[
            { label: 'Calcular el error estándar', value: `SE = √[p(1−p)/n] = √[${formatNumber(p0, 4)}·${formatNumber(1 - p0, 4)}/${n}] = ${formatNumber(Math.sqrt((p0 * (1 - p0)) / n), 4)}` },
            { label: 'Calcular el estadístico Z', value: `Z = (${formatNumber(pHat, 4)} − ${formatNumber(p0, 4)}) / ${formatNumber(Math.sqrt((p0 * (1 - p0)) / n), 4)} = ${formatNumber(z, 4)}` },
            {
              label: `Evaluar P(${form.tail === 'mayor' ? 'p̂ > p̂' : 'p̂ ≤ p̂'})`,
              value: `${form.tail === 'mayor' ? '1 − Φ(Z)' : 'Φ(Z)'} = ${formatPValue(prob)}`,
            },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Dada una proporción muestral de ${formatNumber(pHat, 4)} (${Math.round(pHat * n)} entre ${n}), con una proporción poblacional asumida de ${formatNumber(p0, 4)}, la probabilidad de obtener esa proporción ${form.tail === 'mayor' ? 'o superior' : 'o inferior'} es ${formatPValue(prob)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Probabilidad asociada a proporciones muestrales"
      description="Calcula el estadístico Z y la probabilidad asociada a una proporción muestral."
      form={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input label="Proporción poblacional (p)" value={form.p0} onChange={(e) => setForm((f) => ({ ...f, p0: e.target.value }))} />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input label="Proporción muestral (p̂)" value={form.pHat} onChange={(e) => setForm((f) => ({ ...f, pHat: e.target.value }))} />
          <Select
            label="Probabilidad a calcular"
            value={form.tail}
            onChange={(e) => setForm((f) => ({ ...f, tail: e.target.value as DistMuestralProporcionForm['tail'] }))}
          >
            <option value="menor">P(p̂ ≤ p̂)</option>
            <option value="mayor">P(p̂ &gt; p̂)</option>
          </Select>
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}
