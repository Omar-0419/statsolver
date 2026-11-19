'use client'

import { useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { CalculatorLayout } from '@/components/calculators/shared/CalculatorLayout'
import { StepList } from '@/components/calculators/shared/StepList'
import { NormalIntervalChart } from '@/components/charts/NormalCharts'
import {
  ciDifferenceMeans,
  ciDifferenceProportions,
  ciMeanKnownSigma,
  ciMeanUnknownSigma,
  ciProportion,
} from '@/lib/statistics/confidence-intervals'
import { parseNumber } from '@/lib/statistics/validations'
import { formatNumber } from '@/lib/statistics/formatting'

interface CalcState {
  result?: ReactNode
  development?: ReactNode
  interpretation?: string
  resultsText?: string
  chart?: ReactNode
}

function pnum(raw: string, label: string, opts: { positive?: boolean; integer?: boolean } = {}): { value?: number; error?: string } {
  const v = parseNumber(raw, { label, ...opts })
  return v.ok ? { value: v.value } : { error: v.error }
}

function parseConfidence(confidence: string, customConfidence: string): { value?: number; error?: string } {
  const raw = confidence === 'custom' ? customConfidence : confidence
  const v = parseNumber(raw, { label: 'Nivel de confianza (%)', positive: true, min: 1, max: 100 })
  return v.ok ? { value: v.value! / 100 } : { error: v.error }
}

function ConfidenceFields({
  confidence,
  setConfidence,
  customConfidence,
  setCustomConfidence,
}: {
  confidence: string
  setConfidence: (v: string) => void
  customConfidence: string
  setCustomConfidence: (v: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Select label="Nivel de confianza" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
        <option value="90">90 %</option>
        <option value="95">95 %</option>
        <option value="99">99 %</option>
        <option value="custom">Personalizado</option>
      </Select>
      {confidence === 'custom' ? (
        <Input label="Nivel de confianza (%)" value={customConfidence} onChange={(e) => setCustomConfidence(e.target.value)} help="Entero entre 1 y 100" />
      ) : null}
    </div>
  )
}

const initialConfidenceState = { confidence: '95', customConfidence: '95' }

// ---------------------------------------------------------------------------
// Intervalo de confianza para una media (desviación poblacional conocida)
// ---------------------------------------------------------------------------
interface CIMediaZForm { xbar: string; sigma: string; n: string; confidence: string; customConfidence: string }
const initialCIMediaZForm: CIMediaZForm = { xbar: '10', sigma: '2', n: '36', ...initialConfidenceState }

export function CIMediaZCalc() {
  const [form, setForm] = useState<CIMediaZForm>(initialCIMediaZForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialCIMediaZForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xbarR = pnum(form.xbar, 'Media muestral (X̄)')
    const sigR = pnum(form.sigma, 'Desviación poblacional (σ)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const errors = [xbarR, sigR, nR, confR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const ic = ciMeanKnownSigma({ xbar: xbarR.value!, sigma: sigR.value!, n: nR.value!, confidence: confR.value! })
    const confPct = Math.round(confR.value! * 100)
    const resultsText = `[${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], ME = ${formatNumber(ic.margin, 4)}, z = ${formatNumber(ic.critical, 4)}, SE = ${formatNumber(ic.standardError, 4)}`

    setCalc({
      chart: <NormalIntervalChart statistic={xbarR.value!} lower={ic.lower} upper={ic.upper} />,
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Límite inferior" value={formatNumber(ic.lower, 4)} tone="primary" />
          <StatCard label="Límite superior" value={formatNumber(ic.upper, 4)} tone="accent" />
          <StatCard label="Margen de error" value={formatNumber(ic.margin, 4)} tone="muted" />
          <StatCard label="Estadístico crítico (z)" value={formatNumber(ic.critical, 4)} tone="muted" />
          <StatCard label="Error estándar" value={formatNumber(ic.standardError, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula={ic.formula}
          steps={[
            { label: 'Calcular el error estándar', value: `SE = σ/√n = ${formatNumber(sigR.value!, 4)}/√${nR.value} = ${formatNumber(ic.standardError, 4)}` },
            { label: 'Calcular el estadístico crítico', value: `z = ${formatNumber(ic.critical, 4)} (nivel de confianza ${confPct} %)` },
            { label: 'Calcular el margen de error', value: `ME = z·SE = ${formatNumber(ic.critical, 4)} · ${formatNumber(ic.standardError, 4)} = ${formatNumber(ic.margin, 4)}` },
            { label: 'Calcular el intervalo', value: `[X̄ − ME, X̄ + ME] = [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El intervalo de confianza al ${confPct} % para la media poblacional es [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]. Con una confianza del ${confPct} %, µ se encuentra entre estos límites, y el margen de error es ${formatNumber(ic.margin, 4)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Intervalo de confianza para una media (desviación poblacional conocida)"
      description="Calcula el intervalo de confianza para la media poblacional usando la distribución Z y la desviación poblacional conocida."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
            <Input label="Desviación poblacional (σ)" value={form.sigma} onChange={(e) => setForm((f) => ({ ...f, sigma: e.target.value }))} help="σ > 0" />
            <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          </div>
          <ConfidenceFields
            confidence={form.confidence}
            setConfidence={(v) => setForm((f) => ({ ...f, confidence: v }))}
            customConfidence={form.customConfidence}
            setCustomConfidence={(v) => setForm((f) => ({ ...f, customConfidence: v }))}
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
// Intervalo de confianza para una media (desviación muestral desconocida)
// ---------------------------------------------------------------------------
interface CIMediaTForm { xbar: string; s: string; n: string; confidence: string; customConfidence: string }
const initialCIMediaTForm: CIMediaTForm = { xbar: '10', s: '2.5', n: '25', ...initialConfidenceState }

export function CIMediaTcalc() {
  const [form, setForm] = useState<CIMediaTForm>(initialCIMediaTForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialCIMediaTForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xbarR = pnum(form.xbar, 'Media muestral (X̄)')
    const sR = pnum(form.s, 'Desviación muestral (s)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const errors = [xbarR, sR, nR, confR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const ic = ciMeanUnknownSigma({ xbar: xbarR.value!, s: sR.value!, n: nR.value!, confidence: confR.value! })
    const confPct = Math.round(confR.value! * 100)
    const resultsText = `[${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], ME = ${formatNumber(ic.margin, 4)}, t = ${formatNumber(ic.critical, 4)} (${Math.max(0, nR.value! - 1)} gl), SE = ${formatNumber(ic.standardError, 4)}`

    setCalc({
      chart: <NormalIntervalChart statistic={xbarR.value!} lower={ic.lower} upper={ic.upper} />,
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Límite inferior" value={formatNumber(ic.lower, 4)} tone="primary" />
          <StatCard label="Límite superior" value={formatNumber(ic.upper, 4)} tone="accent" />
          <StatCard label="Margen de error" value={formatNumber(ic.margin, 4)} tone="muted" />
          <StatCard label="Estadístico crítico (t)" value={formatNumber(ic.critical, 4)} tone="muted" />
          <StatCard label="Error estándar" value={formatNumber(ic.standardError, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula={ic.formula}
          steps={[
            { label: 'Calcular el error estándar', value: `SE = s/√n = ${formatNumber(sR.value!, 4)}/√${nR.value} = ${formatNumber(ic.standardError, 4)}` },
            { label: 'Calcular el estadístico crítico', value: `t = ${formatNumber(ic.critical, 4)} (nivel de confianza ${confPct} %, ${Math.max(0, nR.value! - 1)} grados de libertad)` },
            { label: 'Calcular el margen de error', value: `ME = t·SE = ${formatNumber(ic.critical, 4)} · ${formatNumber(ic.standardError, 4)} = ${formatNumber(ic.margin, 4)}` },
            { label: 'Calcular el intervalo', value: `[X̄ − ME, X̄ + ME] = [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El intervalo de confianza al ${confPct} % para la media poblacional es [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], calculado con la distribución t de Student (${Math.max(0, nR.value! - 1)} grados de libertad).`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Intervalo de confianza para una media (desviación muestral desconocida)"
      description="Calcula el intervalo de confianza para la media poblacional usando la distribución T de Student y la desviación muestral desconocida."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
            <Input label="Desviación muestral (s)" value={form.s} onChange={(e) => setForm((f) => ({ ...f, s: e.target.value }))} help="s > 0" />
            <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          </div>
          <ConfidenceFields
            confidence={form.confidence}
            setConfidence={(v) => setForm((f) => ({ ...f, confidence: v }))}
            customConfidence={form.customConfidence}
            setCustomConfidence={(v) => setForm((f) => ({ ...f, customConfidence: v }))}
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
// Intervalo de confianza para una proporción
// ---------------------------------------------------------------------------
interface CIProproporcionForm { pHat: string; n: string; confidence: string; customConfidence: string }
const initialCIProproporcionForm: CIProproporcionForm = { pHat: '0.4', n: '100', ...initialConfidenceState }

export function CIproporcionCalc() {
  const [form, setForm] = useState<CIProproporcionForm>(initialCIProproporcionForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialCIProproporcionForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const pHatR = pnum(form.pHat, 'Proporción muestral (p̂)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const errors = [pHatR, nR, confR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const ic = ciProportion({ pHat: pHatR.value!, n: nR.value!, confidence: confR.value! })
    const confPct = Math.round(confR.value! * 100)
    const resultsText = `[${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], ME = ${formatNumber(ic.margin, 4)}, SE = ${formatNumber(ic.standardError, 4)}`

    setCalc({
      chart: <NormalIntervalChart statistic={pHatR.value!} lower={ic.lower} upper={ic.upper} />,
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Límite inferior" value={formatNumber(ic.lower, 4)} tone="primary" />
          <StatCard label="Límite superior" value={formatNumber(ic.upper, 4)} tone="accent" />
          <StatCard label="Margen de error" value={formatNumber(ic.margin, 4)} tone="muted" />
          <StatCard label="Estadístico crítico (z)" value={formatNumber(ic.critical, 4)} tone="muted" />
          <StatCard label="Error estándar" value={formatNumber(ic.standardError, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula={ic.formula}
          steps={[
            { label: 'Calcular el error estándar', value: `SE = √[p̂(1−p̂)/n] = √[${formatNumber(pHatR.value!, 4)}·${formatNumber(1 - pHatR.value!, 4)}/${nR.value}] = ${formatNumber(ic.standardError, 4)}` },
            { label: 'Calcular el estadístico crítico', value: `z = ${formatNumber(ic.critical, 4)} (nivel de confianza ${confPct} %)` },
            { label: 'Calcular el margen de error', value: `ME = z·SE = ${formatNumber(ic.margin, 4)}` },
            { label: 'Calcular el intervalo', value: `[p̂ − ME, p̂ + ME] = [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El intervalo de confianza al ${confPct} % para la proporción poblacional es [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]. Con una confianza del ${confPct} %, el verdadero valor de p se encuentra entre estos límites, y el margen de error es ${formatNumber(ic.margin, 4)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Intervalo de confianza para una proporción"
      description="Calcula el intervalo de confianza para una proporción poblacional usando la distribución Z."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Proporción muestral (p̂)" value={form.pHat} onChange={(e) => setForm((f) => ({ ...f, pHat: e.target.value }))} help="Frecuencia relativa de éxitos en la muestra" />
            <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
          </div>
          <ConfidenceFields
            confidence={form.confidence}
            setConfidence={(v) => setForm((f) => ({ ...f, confidence: v }))}
            customConfidence={form.customConfidence}
            setCustomConfidence={(v) => setForm((f) => ({ ...f, customConfidence: v }))}
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
// Intervalo de confianza para la diferencia de medias
// ---------------------------------------------------------------------------
interface CIDifMediasForm {
  x1: string
  s1: string
  n1: string
  x2: string
  s2: string
  n2: string
  confidence: string
  customConfidence: string
  known: boolean
}
const initialCIDifMediasForm: CIDifMediasForm = {
  x1: '5', s1: '2', n1: '30', x2: '3', s2: '2', n2: '30',
  ...initialConfidenceState, known: true,
}

export function CIdifMediasCalc() {
  const [form, setForm] = useState<CIDifMediasForm>(initialCIDifMediasForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialCIDifMediasForm)
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
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const errors = [x1R, s1R, n1R, x2R, s2R, n2R, confR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const ic = ciDifferenceMeans({
      x1: x1R.value!, s1: s1R.value!, n1: n1R.value!,
      x2: x2R.value!, s2: s2R.value!, n2: n2R.value!,
      confidence: confR.value!, sigmaKnown: form.known,
    })
    const confPct = Math.round(confR.value! * 100)
    const resultsText = `[${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], ME = ${formatNumber(ic.margin, 4)}, SE = ${formatNumber(ic.standardError, 4)}, ${form.known ? 'z' : 't (Welch)'} = ${formatNumber(ic.critical, 4)}`

    setCalc({
      chart: <NormalIntervalChart statistic={x1R.value! - x2R.value!} lower={ic.lower} upper={ic.upper} />,
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Límite inferior" value={formatNumber(ic.lower, 4)} tone="primary" />
          <StatCard label="Límite superior" value={formatNumber(ic.upper, 4)} tone="accent" />
          <StatCard label="Margen de error" value={formatNumber(ic.margin, 4)} tone="muted" />
          <StatCard label={`Estadístico crítico (${form.known ? 'z' : 't'})`} value={formatNumber(ic.critical, 4)} tone="muted" />
          <StatCard label="Error estándar" value={formatNumber(ic.standardError, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula={ic.formula}
          steps={[
            { label: 'Calcular el error estándar', value: `SE = √[s₁²/n₁ + s₂²/n₂] = √[${formatNumber(s1R.value!, 4)}²/${n1R.value} + ${formatNumber(s2R.value!, 4)}²/${n2R.value}] = ${formatNumber(ic.standardError, 4)}` },
            { label: 'Calcular el estadístico', value: `X̄₁ − X̄₂ = ${formatNumber(x1R.value! - x2R.value!, 4)}` },
            { label: 'Calcular el margen de error', value: `ME = ${form.known ? 'z' : 't'}·SE = ${formatNumber(ic.critical, 4)} · ${formatNumber(ic.standardError, 4)} = ${formatNumber(ic.margin, 4)}` },
            { label: 'Calcular el intervalo', value: `[(X̄₁ − X̄₂) − ME, (X̄₁ − X̄₂) + ME] = [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El intervalo de confianza al ${confPct} % para la diferencia de medias (µ₁ − µ₂) es [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]. Esto significa que el valor esperado de la diferencia entre ${formatNumber(x1R.value! - x2R.value!, 4)} se encuentra entre estos límites con una confianza del ${confPct} %.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Intervalo de confianza para la diferencia de medias"
      description="Calcula el intervalo para la diferencia entre dos medias poblacionales, con varianzas conocidas (Z) o desconocidas (T de Welch)."
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
            <ConfidenceFields
              confidence={form.confidence}
              setConfidence={(v) => setForm((f) => ({ ...f, confidence: v }))}
              customConfidence={form.customConfidence}
              setCustomConfidence={(v) => setForm((f) => ({ ...f, customConfidence: v }))}
            />
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-ss-fg">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-ss-primary"
                  checked={form.known}
                  onChange={(e) => setForm((f) => ({ ...f, known: e.target.checked }))}
                />
                Desviaciones conocidas (distribución Z)
              </label>
            </div>
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
// Intervalo de confianza para la diferencia de proporciones
// ---------------------------------------------------------------------------
interface CIDifProporcionesForm { p1: string; n1: string; p2: string; n2: string; confidence: string; customConfidence: string }
const initialCIDifProporcionesForm: CIDifProporcionesForm = { p1: '0.52', n1: '500', p2: '0.48', n2: '500', ...initialConfidenceState }

export function CIdifProporcionesCalc() {
  const [form, setForm] = useState<CIDifProporcionesForm>(initialCIDifProporcionesForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialCIDifProporcionesForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const p1R = pnum(form.p1, 'Proporción muestral 1 (p̂₁)', { positive: true })
    const n1R = pnum(form.n1, 'Tamaño de muestra 1 (n₁)', { positive: true, integer: true })
    const p2R = pnum(form.p2, 'Proporción muestral 2 (p̂₂)', { positive: true })
    const n2R = pnum(form.n2, 'Tamaño de muestra 2 (n₂)', { positive: true, integer: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const errors = [p1R, n1R, p2R, n2R, confR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const ic = ciDifferenceProportions({
      p1: p1R.value!, n1: n1R.value!, p2: p2R.value!, n2: n2R.value!, confidence: confR.value!,
    })
    const confPct = Math.round(confR.value! * 100)
    const resultsText = `[${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}], ME = ${formatNumber(ic.margin, 4)}, SE = ${formatNumber(ic.standardError, 4)}, z = ${formatNumber(ic.critical, 4)}`

    setCalc({
      chart: <NormalIntervalChart statistic={p1R.value! - p2R.value!} lower={ic.lower} upper={ic.upper} />,
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Límite inferior" value={formatNumber(ic.lower, 4)} tone="primary" />
          <StatCard label="Límite superior" value={formatNumber(ic.upper, 4)} tone="accent" />
          <StatCard label="Margen de error" value={formatNumber(ic.margin, 4)} tone="muted" />
          <StatCard label="Estadístico crítico (z)" value={formatNumber(ic.critical, 4)} tone="muted" />
          <StatCard label="Error estándar" value={formatNumber(ic.standardError, 4)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula={ic.formula}
          steps={[
            { label: 'Calcular la proporción agrupada', value: `p̂ = (x₁ + x₂)/(n₁ + n₂) = (${formatNumber(p1R.value! * n1R.value!, 4)} + ${formatNumber(p2R.value! * n2R.value!, 4)})/(${n1R.value!} + ${n2R.value!}) = ${formatNumber((p1R.value! * n1R.value! + p2R.value! * n2R.value!) / (n1R.value! + n2R.value!), 4)}` },
            { label: 'Calcular el error estándar', value: `SE = √[p̂(1−p̂)(1/n₁ + 1/n₂)] = ${formatNumber(ic.standardError, 4)}` },
            { label: 'Calcular el margen de error', value: `ME = z·SE = ${formatNumber(ic.margin, 4)}` },
            { label: 'Calcular el intervalo', value: `[(p̂₁ − p̂₂) − ME, (p̂₁ − p̂₂) + ME] = [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}]` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El intervalo de confianza al ${confPct} % para la diferencia de proporciones (p₁ − p₂) es [${formatNumber(ic.lower, 4)}, ${formatNumber(ic.upper, 4)}].`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Intervalo de confianza para la diferencia de proporciones"
      description="Calcula el intervalo para la diferencia entre dos proporciones poblacionales con distribución Z."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-4">
            <Input label="Proporción muestral 1 (p̂₁)" value={form.p1} onChange={(e) => setForm((f) => ({ ...f, p1: e.target.value }))} help="p₁ > 0" />
            <Input label="Tamaño de muestra 1 (n₁)" value={form.n1} onChange={(e) => setForm((f) => ({ ...f, n1: e.target.value }))} help="Entero positivo" />
            <Input label="Proporción muestral 2 (p̂₂)" value={form.p2} onChange={(e) => setForm((f) => ({ ...f, p2: e.target.value }))} help="p₂ > 0" />
            <Input label="Tamaño de muestra 2 (n₂)" value={form.n2} onChange={(e) => setForm((f) => ({ ...f, n2: e.target.value }))} help="Entero positivo" />
          </div>
          <ConfidenceFields
            confidence={form.confidence}
            setConfidence={(v) => setForm((f) => ({ ...f, confidence: v }))}
            customConfidence={form.customConfidence}
            setCustomConfidence={(v) => setForm((f) => ({ ...f, customConfidence: v }))}
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
