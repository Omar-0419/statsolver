'use client'

import { useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { CalculatorLayout } from '@/components/calculators/shared/CalculatorLayout'
import { StepList } from '@/components/calculators/shared/StepList'
import { NormalPDFChart } from '@/components/charts/NormalCharts'
import {
  chi2GoodnessFit,
  chi2Independence,
  diffMeansTest,
  diffProportionsTest,
  tTestMean,
  zTestMean,
  zTestProportion,
} from '@/lib/statistics/hypothesis-testing'
import type { Alternative, HypothesisResult } from '@/lib/statistics/types'
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

function parseAlpha(raw: string): { value?: number; error?: string } {
  const v = parseNumber(raw, { label: 'Nivel de significancia (α)', positive: true, min: 0, max: 1 })
  return v.ok ? { value: v.value! } : { error: v.error }
}

function AlternativeFields({
  alternative,
  setAlternative,
}: {
  alternative: Alternative
  setAlternative: (v: Alternative) => void
}) {
  return (
    <Select label="Hipótesis alternativa" value={alternative} onChange={(e) => setAlternative(e.target.value as Alternative)}>
      <option value="dos">Bilateral — H₁: µ ≠ µ₀</option>
      <option value="menor">Unilateral menor — H₁: µ &lt; µ₀</option>
      <option value="mayor">Unilateral mayor — H₁: µ &gt; µ₀</option>
    </Select>
  )
}

function decisionText(r: HypothesisResult, alpha: number): string {
  if (r.decision === 'rechazo_H0') return `Se rechaza la hipótesis nula H₀ al nivel de significancia α = ${formatNumber(alpha, 4)}.`
  return `No hay evidencia suficiente para rechazar la hipótesis nula H₀ al nivel de significancia α = ${formatNumber(alpha, 4)}.`
}

function zChart(r: HypothesisResult, alternative: Alternative, critical?: number): ReactNode {
  if (!critical) return null
  if (alternative === 'dos') return <NormalPDFChart criticals={[-critical, critical]} shade="two-sided" range={[-5, 5]} />
  return <NormalPDFChart criticals={[critical]} shade={alternative === 'menor' ? 'lower-tail' : 'upper-tail'} range={[-5, 5]} />
}

// ---------------------------------------------------------------------------
// Prueba Z para una media
// ---------------------------------------------------------------------------
interface PruebaZMediaForm { xbar: string; mu0: string; sigma: string; n: string; alpha: string; alternative: Alternative }
const initialPruebaZMediaForm: PruebaZMediaForm = { xbar: '10.5', mu0: '10', sigma: '2', n: '36', alpha: '0.05', alternative: 'dos' }

export function PruebaZMediaCalc() {
  const [form, setForm] = useState<PruebaZMediaForm>(initialPruebaZMediaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialPruebaZMediaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xbarR = pnum(form.xbar, 'Media muestral (X̄)')
    const mu0R = pnum(form.mu0, 'Media hipotética (µ₀)')
    const sigR = pnum(form.sigma, 'Desviación poblacional (σ)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const alphaR = parseAlpha(form.alpha)
    const errors = [xbarR, mu0R, sigR, nR, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const r = zTestMean({ xbar: xbarR.value!, mu0: mu0R.value!, sigma: sigR.value!, n: nR.value!, alpha: alphaR.value!, alternative: form.alternative })
    const se = sigR.value! / Math.sqrt(nR.value!)
    const resultsText = `Estadístico z = ${formatNumber(r.statistic, 4)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Estadístico de prueba" value={formatNumber(r.statistic, 4)} tone="primary" />
            <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
            <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
            <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
            <StatCard label="Nivel de significancia (α)" value={formatNumber(alphaR.value!, 4)} tone="muted" />
          </div>
          <div className="max-w-2xl">{zChart(r, form.alternative, r.critical)}</div>
        </div>
      ),
      development: (
        <StepList
          formula="z = (X̄ − µ₀) / (σ/√n)"
          steps={[
            { label: 'Calcular el error estándar', value: `SE = σ/√n = ${formatNumber(sigR.value!, 4)}/√${nR.value} = ${formatNumber(se, 4)}` },
            { label: 'Calcular el estadístico de prueba', value: `z = (${formatNumber(xbarR.value!, 4)} − ${formatNumber(mu0R.value!, 4)}) / ${formatNumber(se, 4)} = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: form.alternative === 'dos' ? `p = 2·(1 − Φ(|z|)) = ${formatPValue(r.pValue)}` : `p = Φ(z) = ${formatPValue(r.pValue)}` },
            { label: 'Comparar con el valor crítico', value: `z = ${formatNumber(r.statistic, 4)}, valor crítico = ${formatNumber(r.critical!, 4)}, ${r.decision === 'rechazo_H0' ? '|z| > |crítico| → rechazo H₀' : 'no se rechaza H₀'}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: r.interpretation + ' ' + decisionText(r, alphaR.value!),
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba Z para una media"
      description="Prueba de hipótesis para la media poblacional usando la distribución Z y la desviación poblacional conocida."
      form={
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
          <Input label="Media hipotética (µ₀)" value={form.mu0} onChange={(e) => setForm((f) => ({ ...f, mu0: e.target.value }))} />
          <Input label="Desviación poblacional (σ)" value={form.sigma} onChange={(e) => setForm((f) => ({ ...f, sigma: e.target.value }))} help="σ > 0" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1, por defecto 0.05" />
          <AlternativeFields alternative={form.alternative} setAlternative={(v) => setForm((f) => ({ ...f, alternative: v }))} />
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
// Prueba T para una media
// ---------------------------------------------------------------------------
interface PruebaTMediaForm { xbar: string; mu0: string; s: string; n: string; alpha: string; alternative: Alternative }
const initialPruebaTMediaForm: PruebaTMediaForm = { xbar: '9.5', mu0: '10', s: '2.5', n: '25', alpha: '0.05', alternative: 'dos' }

export function PruebaTMediaCalc() {
  const [form, setForm] = useState<PruebaTMediaForm>(initialPruebaTMediaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialPruebaTMediaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xbarR = pnum(form.xbar, 'Media muestral (X̄)')
    const mu0R = pnum(form.mu0, 'Media hipotética (µ₀)')
    const sR = pnum(form.s, 'Desviación muestral (s)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const alphaR = parseAlpha(form.alpha)
    const errors = [xbarR, mu0R, sR, nR, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const r = tTestMean({ xbar: xbarR.value!, mu0: mu0R.value!, s: sR.value!, n: nR.value!, alpha: alphaR.value!, alternative: form.alternative })
    const se = sR.value! / Math.sqrt(nR.value!)
    const gl = Math.max(0, nR.value! - 1)
    const resultsText = `Estadístico t = ${formatNumber(r.statistic, 4)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Estadístico de prueba" value={formatNumber(r.statistic, 4)} tone="primary" />
            <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
            <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
            <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
            <StatCard label="Gl" value={String(gl)} tone="muted" />
          </div>
          <div className="max-w-2xl">{zChart(r, form.alternative, r.critical)}</div>
        </div>
      ),
      development: (
        <StepList
          formula="t = (X̄ − µ₀) / (s/√n)"
          steps={[
            { label: 'Calcular el error estándar', value: `SE = s/√n = ${formatNumber(sR.value!, 4)}/√${nR.value} = ${formatNumber(se, 4)}` },
            { label: 'Calcular el estadístico de prueba', value: `t = (${formatNumber(xbarR.value!, 4)} − ${formatNumber(mu0R.value!, 4)}) / ${formatNumber(se, 4)} = ${formatNumber(r.statistic, 4)} (${gl} grados de libertad)` },
            { label: 'Calcular el valor p', value: form.alternative === 'dos' ? `p = 2·(1 − F_t(|t|, ${gl})) = ${formatPValue(r.pValue)}` : `p = F_t(t, ${gl}) = ${formatPValue(r.pValue)}` },
            { label: 'Comparar con el valor crítico', value: `t = ${formatNumber(r.statistic, 4)}, valor crítico = ${formatNumber(r.critical!, 4)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: r.interpretation + ' ' + decisionText(r, alphaR.value!),
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba T para una media"
      description="Prueba de hipótesis para la media poblacional usando la distribución T de Student y la desviación muestral desconocida."
      form={
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
          <Input label="Media hipotética (µ₀)" value={form.mu0} onChange={(e) => setForm((f) => ({ ...f, mu0: e.target.value }))} />
          <Input label="Desviación muestral (s)" value={form.s} onChange={(e) => setForm((f) => ({ ...f, s: e.target.value }))} help="s > 0" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
          <AlternativeFields alternative={form.alternative} setAlternative={(v) => setForm((f) => ({ ...f, alternative: v }))} />
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
// Prueba Z para una proporción
// ---------------------------------------------------------------------------
interface PruebaZProporcionForm { pHat: string; p0: string; n: string; alpha: string; alternative: Alternative }
const initialPruebaZProporcionForm: PruebaZProporcionForm = { pHat: '0.45', p0: '0.4', n: '200', alpha: '0.05', alternative: 'dos' }

export function PruebaZProporcionCalc() {
  const [form, setForm] = useState<PruebaZProporcionForm>(initialPruebaZProporcionForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialPruebaZProporcionForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const pHatR = pnum(form.pHat, 'Proporción muestral (p̂)', { positive: true })
    const p0R = pnum(form.p0, 'Proporción hipotética (p₀)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const alphaR = parseAlpha(form.alpha)
    const errors = [pHatR, p0R, nR, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const r = zTestProportion({ pHat: pHatR.value!, p0: p0R.value!, n: nR.value!, alpha: alphaR.value!, alternative: form.alternative })
    const se = Math.sqrt((p0R.value! * (1 - p0R.value!)) / nR.value!)
    const resultsText = `Estadístico z = ${formatNumber(r.statistic, 4)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Estadístico de prueba" value={formatNumber(r.statistic, 4)} tone="primary" />
            <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
            <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
            <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
            <StatCard label="Nivel de significancia (α)" value={formatNumber(alphaR.value!, 4)} tone="muted" />
          </div>
          <div className="max-w-2xl">{zChart(r, form.alternative, r.critical)}</div>
        </div>
      ),
      development: (
        <StepList
          formula="z = (p̂ − p₀) / √[p₀(1−p₀)/n]"
          steps={[
            { label: 'Calcular el error estándar bajo H₀', value: `SE = √[p₀(1−p₀)/n] = √[${formatNumber(p0R.value!, 4)}·${formatNumber(1 - p0R.value!, 4)}/${nR.value}] = ${formatNumber(se, 4)}` },
            { label: 'Calcular el estadístico de prueba', value: `z = (${formatNumber(pHatR.value!, 4)} − ${formatNumber(p0R.value!, 4)}) / ${formatNumber(se, 4)} = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: form.alternative === 'dos' ? `p = 2·(1 − Φ(|z|)) = ${formatPValue(r.pValue)}` : `p = Φ(z) = ${formatPValue(r.pValue)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: r.interpretation + ' ' + decisionText(r, alphaR.value!),
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba Z para una proporción"
      description="Prueba de hipótesis para una proporción poblacional usando la distribución Z."
      form={
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Input label="Proporción muestral (p̂)" value={form.pHat} onChange={(e) => setForm((f) => ({ ...f, pHat: e.target.value }))} help="p̂ entre 0 y 1" />
          <Input label="Proporción hipotética (p₀)" value={form.p0} onChange={(e) => setForm((f) => ({ ...f, p0: e.target.value }))} help="p₀ entre 0 y 1" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
          <AlternativeFields alternative={form.alternative} setAlternative={(v) => setForm((f) => ({ ...f, alternative: v }))} />
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
// Prueba para la diferencia de medias
// ---------------------------------------------------------------------------
interface PruebaDifMediasForm { x1: string; s1: string; n1: string; x2: string; s2: string; n2: string; alpha: string; alternative: Alternative; sigmaKnown: boolean }
const initialPruebaDifMediasForm: PruebaDifMediasForm = {
  x1: '5', s1: '2', n1: '30', x2: '3', s2: '2', n2: '30', alpha: '0.05', alternative: 'dos', sigmaKnown: true,
}

export function PruebaDifMediasCalc() {
  const [form, setForm] = useState<PruebaDifMediasForm>(initialPruebaDifMediasForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialPruebaDifMediasForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const x1R = pnum(form.x1, 'Media muestral 1 (X̄₁)')
    const s1R = pnum(form.s1, 'Desviación 1 (s₁)', { positive: true })
    const n1R = pnum(form.n1, 'Tamaño de muestra 1 (n₁)', { positive: true, integer: true })
    const x2R = pnum(form.x2, 'Media muestral 2 (X̄₂)')
    const s2R = pnum(form.s2, 'Desviación 2 (s₂)', { positive: true })
    const n2R = pnum(form.n2, 'Tamaño de muestra 2 (n₂)', { positive: true, integer: true })
    const alphaR = parseAlpha(form.alpha)
    const errors = [x1R, s1R, n1R, x2R, s2R, n2R, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const r = diffMeansTest({
      x1: x1R.value!, s1: s1R.value!, n1: n1R.value!,
      x2: x2R.value!, s2: s2R.value!, n2: n2R.value!,
      alpha: alphaR.value!, alternative: form.alternative, sigmaKnown: form.sigmaKnown,
    })
    const diff = x1R.value! - x2R.value!
    const resultsText = `Estadístico ${form.sigmaKnown ? 'z' : 't'} = ${formatNumber(r.statistic, 4)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Estadístico de prueba" value={formatNumber(r.statistic, 4)} tone="primary" />
            <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
            <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
            <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
            <StatCard label="Nivel de significancia (α)" value={formatNumber(alphaR.value!, 4)} tone="muted" />
          </div>
          <div className="max-w-2xl">{zChart(r, form.alternative, r.critical)}</div>
        </div>
      ),
      development: (
        <StepList
          formula={`${form.sigmaKnown ? 'z' : 't (Welch)'} = (X̄₁ − X̄₂) / √[s₁²/n₁ + s₂²/n₂]`}
          steps={[
            { label: 'Calcular el estadístico de diferencia', value: `X̄₁ − X̄₂ = ${formatNumber(diff, 4)}` },
            { label: 'Calcular el error estándar', value: `SE = √[s₁²/n₁ + s₂²/n₂] = ${formatNumber(r.statistic !== 0 ? diff / r.statistic : 0, 4)}` },
            { label: 'Calcular el estadístico de prueba', value: `${form.sigmaKnown ? 'z' : 't (Welch)'} = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: form.alternative === 'dos' ? `p = 2·(1 − Φ(|z|)) = ${formatPValue(r.pValue)}` : `p = Φ(z) = ${formatPValue(r.pValue)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: r.interpretation + ' ' + decisionText(r, alphaR.value!),
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba para la diferencia de medias"
      description="Prueba de hipótesis para la diferencia entre dos medias poblacionales, con varianzas conocidas (Z) o desconocidas (T de Welch)."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Input label="Media muestral 1 (X̄₁)" value={form.x1} onChange={(e) => setForm((f) => ({ ...f, x1: e.target.value }))} />
            <Input label="Desviación 1 (s₁)" value={form.s1} onChange={(e) => setForm((f) => ({ ...f, s1: e.target.value }))} help="s₁ > 0" />
            <Input label="Tamaño de muestra 1 (n₁)" value={form.n1} onChange={(e) => setForm((f) => ({ ...f, n1: e.target.value }))} help="Entero positivo" />
            <Input label="Media muestral 2 (X̄₂)" value={form.x2} onChange={(e) => setForm((f) => ({ ...f, x2: e.target.value }))} />
            <Input label="Desviación 2 (s₂)" value={form.s2} onChange={(e) => setForm((f) => ({ ...f, s2: e.target.value }))} help="s₂ > 0" />
            <Input label="Tamaño de muestra 2 (n₂)" value={form.n2} onChange={(e) => setForm((f) => ({ ...f, n2: e.target.value }))} help="Entero positivo" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
            <AlternativeFields alternative={form.alternative} setAlternative={(v) => setForm((f) => ({ ...f, alternative: v }))} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-ss-fg">
              <input
                type="checkbox"
                className="h-4 w-4 accent-ss-primary"
                checked={form.sigmaKnown}
                onChange={(e) => setForm((f) => ({ ...f, sigmaKnown: e.target.checked }))}
              />
              Desviaciones conocidas (usar distribución Z)
            </label>
          </div>
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
// Prueba para la diferencia de proporciones
// ---------------------------------------------------------------------------
interface PruebaDifProporcionesForm { p1: string; n1: string; p2: string; n2: string; alpha: string; alternative: Alternative }
const initialPruebaDifProporcionesForm: PruebaDifProporcionesForm = {
  p1: '0.52', n1: '500', p2: '0.48', n2: '500', alpha: '0.05', alternative: 'dos',
}

export function PruebaDifProporcionesCalc() {
  const [form, setForm] = useState<PruebaDifProporcionesForm>(initialPruebaDifProporcionesForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialPruebaDifProporcionesForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const p1R = pnum(form.p1, 'Proporción muestral 1 (p̂₁)', { positive: true })
    const n1R = pnum(form.n1, 'Tamaño de muestra 1 (n₁)', { positive: true, integer: true })
    const p2R = pnum(form.p2, 'Proporción muestral 2 (p̂₂)', { positive: true })
    const n2R = pnum(form.n2, 'Tamaño de muestra 2 (n₂)', { positive: true, integer: true })
    const alphaR = parseAlpha(form.alpha)
    const errors = [p1R, n1R, p2R, n2R, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const r = diffProportionsTest({
      p1: p1R.value!, n1: n1R.value!, p2: p2R.value!, n2: n2R.value!, alpha: alphaR.value!, alternative: form.alternative,
    })
    const diff = p1R.value! - p2R.value!
    const resultsText = `Estadístico z = ${formatNumber(r.statistic, 4)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Estadístico de prueba" value={formatNumber(r.statistic, 4)} tone="primary" />
            <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
            <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
            <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
            <StatCard label="Nivel de significancia (α)" value={formatNumber(alphaR.value!, 4)} tone="muted" />
          </div>
          <div className="max-w-2xl">{zChart(r, form.alternative, r.critical)}</div>
        </div>
      ),
      development: (
        <StepList
          formula="z = (p̂₁ − p̂₂) / √[p̂(1−p̂)(1/n₁ + 1/n₂)]"
          steps={[
            { label: 'Calcular las proporciones agrupadas', value: `p̂ = (x₁ + x₂)/(n₁ + n₂) = ${formatNumber((p1R.value! * n1R.value! + p2R.value! * n2R.value!) / (n1R.value! + n2R.value!), 4)}` },
            { label: 'Calcular el error estándar', value: `SE = √[p̂(1−p̂)(1/n₁ + 1/n₂)] = ${formatNumber(r.statistic !== 0 ? diff / r.statistic : 0, 4)}` },
            { label: 'Calcular el estadístico de prueba', value: `z = (${formatNumber(diff, 4)}) / SE = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: form.alternative === 'dos' ? `p = 2·(1 − Φ(|z|)) = ${formatPValue(r.pValue)}` : `p = Φ(z) = ${formatPValue(r.pValue)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: r.interpretation + ' ' + decisionText(r, alphaR.value!),
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba para la diferencia de proporciones"
      description="Prueba de hipótesis para la diferencia entre dos proporciones poblacionales con proporciones agrupadas."
      form={
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          <Input label="Proporción muestral 1 (p̂₁)" value={form.p1} onChange={(e) => setForm((f) => ({ ...f, p1: e.target.value }))} help="p₁ > 0" />
          <Input label="Tamaño de muestra 1 (n₁)" value={form.n1} onChange={(e) => setForm((f) => ({ ...f, n1: e.target.value }))} help="Entero positivo" />
          <Input label="Proporción muestral 2 (p̂₂)" value={form.p2} onChange={(e) => setForm((f) => ({ ...f, p2: e.target.value }))} help="p₂ > 0" />
          <Input label="Tamaño de muestra 2 (n₂)" value={form.n2} onChange={(e) => setForm((f) => ({ ...f, n2: e.target.value }))} help="Entero positivo" />
          <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
          <AlternativeFields alternative={form.alternative} setAlternative={(v) => setForm((f) => ({ ...f, alternative: v }))} />
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
// Chi-cuadrado de independencia
// ---------------------------------------------------------------------------
interface Chi2IndependenciaForm { a: string; b: string; c: string; d: string; alpha: string }
const initialChi2IndependenciaForm: Chi2IndependenciaForm = { a: '10', b: '30', c: '20', d: '60', alpha: '0.05' }

export function Chi2IndependenciaCalc() {
  const [form, setForm] = useState<Chi2IndependenciaForm>(initialChi2IndependenciaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialChi2IndependenciaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const cells = [form.a, form.b, form.c, form.d].map((raw, i) => pnum(raw, `Valor de la celda (${Math.floor(i / 2) + 1},${(i % 2) + 1})`, { positive: true }))
    const alphaR = parseAlpha(form.alpha)
    const errors = [...cells, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const table = [[cells[0]!.value!, cells[1]!.value!], [cells[2]!.value!, cells[3]!.value!]]
    const r = chi2Independence(table, alphaR.value!)
    const resultsText = `χ² = ${formatNumber(r.statistic, 4)}, gl = ${r.critical !== undefined ? '' : ''}${Math.max(0, table.length - 1) * Math.max(0, table[0].length - 1)}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Estadístico χ²" value={formatNumber(r.statistic, 4)} tone="primary" />
          <StatCard label="Grados de libertad" value={String(Math.max(0, table.length - 1) * Math.max(0, table[0].length - 1))} tone="muted" />
          <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
          <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
          <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
        </div>
      ),
      development: (
        <StepList
          formula="χ² = Σ[(O − E)²/E], E = (Fila × Columna)/Total"
          steps={[
            { label: 'Armar la tabla de contingencia', value: `[${cells.map((c) => formatNumber(c.value!, 4)).join(' | ')}]` },
            { label: 'Calcular los valores esperados', value: `E = (Fila × Columna)/Total` },
            { label: 'Calcular χ²', value: `χ² = Σ(O − E)²/E = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: `p = ${formatPValue(r.pValue)} (distribución χ² con ${Math.max(0, table.length - 1) * Math.max(0, table[0].length - 1)} gl)` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El estadístico χ² para probar la independencia de las variables categóricas es ${formatNumber(r.statistic, 4)}. ${r.decision === 'rechazo_H0' ? 'Se rechaza la independencia.' : 'No se rechaza la independencia.'} ${decisionText(r, alphaR.value!)}`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba Chi-cuadrado de independencia"
      description="Prueba de independencia para tablas de contingencia 2×2 con la distribución Chi-cuadrado."
      form={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-ss-border p-4">
            <Input label="(1,1)" value={form.a} onChange={(e) => setForm((f) => ({ ...f, a: e.target.value }))} />
            <Input label="(1,2)" value={form.b} onChange={(e) => setForm((f) => ({ ...f, b: e.target.value }))} />
            <Input label="(2,1)" value={form.c} onChange={(e) => setForm((f) => ({ ...f, c: e.target.value }))} />
            <Input label="(2,2)" value={form.d} onChange={(e) => setForm((f) => ({ ...f, d: e.target.value }))} />
          </div>
          <div className="flex flex-col justify-end gap-4">
            <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
          </div>
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
// Chi-cuadrado de bondad de ajuste
// ---------------------------------------------------------------------------
interface Chi2BondadForm { observed: string; expected: string; alpha: string }
const initialChi2BondadForm: Chi2BondadForm = { observed: '10, 20, 30, 40', expected: '20, 20, 20, 20', alpha: '0.05' }

function parseArray(raw: string, label: string): { values?: number[]; error?: string } {
  const parts = raw.split(/[,;]/).map((s) => s.trim()).filter((s) => s.length > 0)
  const values: number[] = []
  for (const part of parts) {
    const v = parseNumber(part, { label })
    if (!v.ok) return { error: v.error }
    if ((v.value ?? 0) < 0) return { error: `${label}: los valores deben ser no negativos.` }
    values.push(v.value!)
  }
  if (values.length === 0) return { error: `${label}: al menos un valor es necesario.` }
  return { values }
}

export function Chi2BondadAjusteCalc() {
  const [form, setForm] = useState<Chi2BondadForm>(initialChi2BondadForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialChi2BondadForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const obsR = parseArray(form.observed, 'Valores observados')
    const expR = parseArray(form.expected, 'Valores esperados')
    const alphaR = parseAlpha(form.alpha)
    const errors = [obsR, expR, alphaR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const observed = obsR.values!
    const expected = expR.values!
    if (observed.length !== expected.length) {
      setErr('Los valores observados y esperados deben tener la misma cantidad de elementos.')
      setCalc(null)
      return
    }

    const r = chi2GoodnessFit({ observed, expected, alpha: alphaR.value! })
    const df = observed.length - 1
    const resultsText = `χ² = ${formatNumber(r.statistic, 4)}, gl = ${df}, valor p = ${formatPValue(r.pValue)}, ${decisionText(r, alphaR.value!)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Estadístico χ²" value={formatNumber(r.statistic, 4)} tone="primary" />
          <StatCard label="Grados de libertad" value={String(df)} tone="muted" />
          <StatCard label="Valor crítico" value={formatNumber(r.critical!, 4)} tone="muted" />
          <StatCard label="Valor p" value={formatPValue(r.pValue)} tone="accent" />
          <StatCard label="Decisión" value={r.decision === 'rechazo_H0' ? 'Rechazo H₀' : 'Acepto H₀'} tone={r.decision === 'rechazo_H0' ? 'danger' : 'success'} />
        </div>
      ),
      development: (
        <StepList
          formula="χ² = Σ[(O − E)²/E]"
          steps={[
            { label: 'Valores observados', value: observed.map((o) => `${o}`).join(', ') },
            { label: 'Valores esperados', value: expected.map((e) => `${e}`).join(', ') },
            { label: 'Calcular χ²', value: `χ² = Σ[(O − E)²/E] = ${formatNumber(r.statistic, 4)}` },
            { label: 'Calcular el valor p', value: `p = ${formatPValue(r.pValue)} (distribución χ² con ${df} gl)` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El estadístico χ² para bondad de ajuste es ${formatNumber(r.statistic, 4)}. ${r.decision === 'rechazo_H0' ? 'Se rechaza la hipótesis nula de que los datos se ajustan al modelo.' : 'No se rechaza la hipótesis nula: los datos se ajustan razonablemente al modelo.'} ${decisionText(r, alphaR.value!)}`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Prueba Chi-cuadrado de bondad de ajuste"
      description="Prueba de bondad de ajuste para verificar si una distribución observada se ajusta a una distribución esperada."
      form={
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Valores observados (separados por comas)" value={form.observed} onChange={(e) => setForm((f) => ({ ...f, observed: e.target.value }))} help="Ej: 10, 20, 30, 40" />
          <Input label="Valores esperados (separados por comas)" value={form.expected} onChange={(e) => setForm((f) => ({ ...f, expected: e.target.value }))} help="Ej: 20, 20, 20, 20" />
          <Input label="Nivel de significancia (α)" value={form.alpha} onChange={(e) => setForm((f) => ({ ...f, alpha: e.target.value }))} help="Entre 0 y 1" />
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}
