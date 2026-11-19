'use client'

import { useState, type ReactNode } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { CalculatorLayout } from '@/components/calculators/shared/CalculatorLayout'
import { StepList } from '@/components/calculators/shared/StepList'
import { confidenceZ, sampleSizeMean, sampleSizeMeanFinite, sampleSizeProportion, sampleSizeProportionFinite, seMean, seProportion, seSampleMean } from '@/lib/statistics/estimation'
import { parseNumber } from '@/lib/statistics/validations'
import { formatNumber } from '@/lib/statistics/formatting'

interface CalcState {
  result?: ReactNode
  development?: ReactNode
  interpretation?: string
  resultsText?: string
}

function pnum(raw: string, label: string, opts: { positive?: boolean; integer?: boolean; min?: number; max?: number } = {}): { value?: number; error?: string } {
  const v = parseNumber(raw, { label, ...opts })
  return v.ok ? { value: v.value } : { error: v.error }
}

function parseConfidence(confidence: string, customConfidence: string): { value?: number; error?: string } {
  if (confidence === 'custom') {
    const v = parseNumber(customConfidence, { label: 'Nivel de confianza (%)', positive: true, min: 1, max: 100 })
    return v.ok ? { value: v.value! / 100 } : { error: v.error }
  }
  const v = parseNumber(confidence, { label: 'Nivel de confianza (%)', positive: true, min: 1, max: 100 })
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
// Tamaño de muestra para una media
// ---------------------------------------------------------------------------
interface TamanoMuestraMediaForm { desv: string; e: string; confidence: string; customConfidence: string; N: string }
const initialTamanoMuestraMediaForm: TamanoMuestraMediaForm = { desv: '1', e: '0.1', ...initialConfidenceState, N: '' }

export function TamanoMuestraMediaCalc() {
  const [form, setForm] = useState<TamanoMuestraMediaForm>(initialTamanoMuestraMediaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialTamanoMuestraMediaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const desvR = pnum(form.desv, 'Desviación (σ o s)', { positive: true })
    const eR = pnum(form.e, 'Margen de error (e)', { positive: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const nRR = form.N.trim() === '' ? undefined : pnum(form.N, 'Población finita (N)', { positive: true, integer: true })
    const errors = [desvR, eR, confR, nRR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const sigma = desvR.value!
    const e = eR.value!
    const confidence = confR.value!
    const n0 = sampleSizeMean(sigma, e, confidence).n
    const N = nRR?.value
    const n = N ? sampleSizeMeanFinite(n0, N).n : n0

    const resultsText = `n = ${n}, n₀ = ${n0}${N ? `, N = ${N}` : ''}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Tamaño de muestra (n)" value={String(n)} tone="primary" />
          <StatCard label="n₀ sin población finita" value={String(n0)} tone="muted" />
          {N ? <StatCard label="Población finita (N)" value={String(N)} tone="muted" /> : null}
        </div>
      ),
      development: (
        <StepList
          formula={N ? 'n = n₀ / (1 + (n₀ − 1)/N), n₀ = (z·σ/e)²' : 'n₀ = (z·σ/e)²'}
          steps={[
            { label: `Calcular el valor z para un nivel de confianza del ${Math.round(confidence * 100)} %`, value: `z = ${formatNumber(confidenceZ(confidence), 4)}` },
            { label: 'Calcular n₀ = (z·σ/e)²', value: `n₀ = (${formatNumber(confidenceZ(confidence), 4)}·${formatNumber(sigma, 4)}/${formatNumber(e, 4)})² = ${n0}` },
            ...(N ? [{ label: 'Corregir por población finita', value: `n = ${n0} / (1 + (${n0} − 1)/${N}) = ${n}` }] : []),
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Para estimar una media con un margen de error de ±${formatNumber(e, 4)} a un nivel de confianza del ${Math.round(confidence * 100)} %, se requiere una muestra de ${n} observaciones (n₀ = ${n0}${N ? `, con población finita N = ${N}` : ''}).`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Tamaño de muestra para estimar una media"
      description="Calcula el número de observaciones necesarias para estimar una media con un margen de error determinado."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Desviación (σ o s)" value={form.desv} onChange={(e) => setForm((f) => ({ ...f, desv: e.target.value }))} help="Desviación estándar de la población o estimación con la muestra" />
            <Input label="Margen de error (e)" value={form.e} onChange={(e) => setForm((f) => ({ ...f, e: e.target.value }))} help="Intervalo permitido de incertidumbre" />
            <Input label="Población finita (N, opcional)" value={form.N} onChange={(e) => setForm((f) => ({ ...f, N: e.target.value }))} help="Dejar vacío si la población es infinita" />
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
// Tamaño de muestra para una proporción
// ---------------------------------------------------------------------------
interface TamanoMuestraProporcionForm { p: string; e: string; confidence: string; customConfidence: string; N: string }
const initialTamanoMuestraProporcionForm: TamanoMuestraProporcionForm = { p: '0.5', e: '0.05', ...initialConfidenceState, N: '' }

export function TamanoMuestraProporcionCalc() {
  const [form, setForm] = useState<TamanoMuestraProporcionForm>(initialTamanoMuestraProporcionForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialTamanoMuestraProporcionForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const pR = form.p.trim() === '' ? undefined : pnum(form.p, 'Proporción estimada (p̂)', { positive: true })
    const eR = pnum(form.e, 'Margen de error (e)', { positive: true })
    const confR = parseConfidence(form.confidence, form.customConfidence)
    const nRR = form.N.trim() === '' ? undefined : pnum(form.N, 'Población finita (N)', { positive: true, integer: true })
    const errors = [eR, confR, nRR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const confidence = confR.value!
    const p = pR?.value ?? 0.5
    const e = eR.value!
    const n0 = sampleSizeProportion(p, e, confidence).n
    const N = nRR?.value
    const n = N ? sampleSizeProportionFinite(n0, N).n : n0

    const resultsText = `n = ${n} (p̂ = ${formatNumber(p, 4)})${N ? `, N = ${N}` : ''}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard label="Tamaño de muestra (n)" value={String(n)} tone="primary" />
          <StatCard label="Proporción estimada (p̂)" value={formatNumber(p, 4)} tone="muted" />
          {N ? <StatCard label="Población finita (N)" value={String(N)} tone="muted" /> : null}
        </div>
      ),
      development: (
        <StepList
          formula={N ? 'n = n₀ / (1 + (n₀ − 1)/N), n₀ = z²·p̂(1−p̂)/e²' : 'n = z²·p̂(1−p̂)/e²'}
          steps={[
            { label: 'Calcular z para el nivel de confianza', value: `z = ${formatNumber(confidenceZ(confidence), 4)}` },
            { label: 'Calcular p̂(1−p̂)', value: `p̂(1−p̂) = ${formatNumber(p * (1 - p), 4)}` },
            { label: 'Calcular n₀ = z²·p̂(1−p̂)/e²', value: `n₀ = ${formatNumber(confidenceZ(confidence), 4)}² · ${formatNumber(p * (1 - p), 4)} / ${formatNumber(e, 4)}² = ${n0}` },
            ...(N ? [{ label: 'Corregir por población finita', value: `n = ${n0} / (1 + (${n0} − 1)/${N}) = ${n}` }] : []),
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `Para estimar una proporción con un margen de error de ±${formatNumber(e, 4)} a un nivel de confianza del ${Math.round(confidence * 100)} %, se requiere una muestra de ${n} observaciones (con p̂ = ${formatNumber(p, 4)}${N ? `, N = ${N}` : ''}).`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Tamaño de muestra para estimar una proporción"
      description="Calcula el número de observaciones necesarias para estimar una proporción con un margen de error determinado."
      form={
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Proporción estimada (p̂)" value={form.p} onChange={(e) => setForm((f) => ({ ...f, p: e.target.value }))} help="Dejar vacío para usar 0.5 (máxima variabilidad)" />
            <Input label="Margen de error (e)" value={form.e} onChange={(e) => setForm((f) => ({ ...f, e: e.target.value }))} help="Intervalo permitido de incertidumbre" />
            <Input label="Población finita (N, opcional)" value={form.N} onChange={(e) => setForm((f) => ({ ...f, N: e.target.value }))} help="Dejar vacío si la población es infinita" />
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
// Estimación de una media puntual
// ---------------------------------------------------------------------------
interface EstimacionMediaForm { xbar: string; s: string; n: string }
const initialEstimacionMediaForm: EstimacionMediaForm = { xbar: '10', s: '2', n: '36' }

export function EstimacionMediaCalc() {
  const [form, setForm] = useState<EstimacionMediaForm>(initialEstimacionMediaForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialEstimacionMediaForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xbarR = pnum(form.xbar, 'Media muestral (X̄)')
    const sR = pnum(form.s, 'Desviación muestral (s)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const errors = [xbarR, sR, nR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const xbar = xbarR.value!
    const s = sR.value!
    const n = nR.value!
    const se = seSampleMean(s, n)

    const resultsText = `X̄ = ${formatNumber(xbar, 4)}, SE = ${formatNumber(se, 4)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Estimación puntual (X̄)" value={formatNumber(xbar, 4)} tone="primary" />
          <StatCard label="Error estándar" value={formatNumber(se, 4)} tone="muted" />
          <StatCard label="Desviación muestral (s)" value={formatNumber(s, 4)} tone="muted" />
          <StatCard label="Tamaño de muestra (n)" value={String(n)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="SE = s/√n"
          steps={[
            { label: 'Estimación puntual del promedio poblacional', value: `X̄ = ${formatNumber(xbar, 4)}` },
            { label: 'Calcular el error estándar', value: `SE = s/√n = ${formatNumber(s, 4)}/√${n} = ${formatNumber(se, 4)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `El estimador del promedio poblacional es X̄ = ${formatNumber(xbar, 4)}, con un error estándar de ${formatNumber(se, 4)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Estimación de una media"
      description="Calcula la estimación puntual del promedio poblacional a partir de una muestra y su error estándar."
      form={
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Media muestral (X̄)" value={form.xbar} onChange={(e) => setForm((f) => ({ ...f, xbar: e.target.value }))} />
          <Input label="Desviación muestral (s)" value={form.s} onChange={(e) => setForm((f) => ({ ...f, s: e.target.value }))} help="s > 0" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
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
// Estimación de una proporción
// ---------------------------------------------------------------------------
interface EstimacionProporcionForm { x: string; n: string }
const initialEstimacionProporcionForm: EstimacionProporcionForm = { x: '40', n: '100' }

export function EstimacionProporcionCalc() {
  const [form, setForm] = useState<EstimacionProporcionForm>(initialEstimacionProporcionForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialEstimacionProporcionForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const xR = pnum(form.x, 'Número de éxitos (x)', { positive: true, integer: true, min: 0 })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const errors = [xR, nR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const x = xR.value!
    const n = nR.value!
    const p = x / n
    const se = seProportion(p, n)

    const resultsText = `p̂ = ${formatNumber(p, 4)}, SE = ${formatNumber(se, 4)}`
    setCalc({
      result: (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Proporción estimada (p̂)" value={formatNumber(p, 4)} tone="primary" />
          <StatCard label="Error estándar" value={formatNumber(se, 4)} tone="muted" />
          <StatCard label="Número de éxitos (x)" value={String(x)} tone="muted" />
          <StatCard label="Tamaño de muestra (n)" value={String(n)} tone="muted" />
        </div>
      ),
      development: (
        <StepList
          formula="p̂ = x/n, SE = √[p̂(1−p̂)/n]"
          steps={[
            { label: 'Calcular la proporción estimada', value: `p̂ = x/n = ${x}/${n} = ${formatNumber(p, 4)}` },
            { label: 'Calcular el error estándar', value: `SE = √[${formatNumber(p, 4)}·${formatNumber(1 - p, 4)}/${n}] = ${formatNumber(se, 4)}` },
          ]}
          copyText={resultsText}
        />
      ),
      interpretation: `La proporción estimada de la población es p̂ = ${formatNumber(p, 4)}, con un error estándar de ${formatNumber(se, 4)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Estimación de una proporción"
      description="Calcula la estimación puntual de una proporción poblacional a partir de la frecuencia relativa de éxitos en la muestra."
      form={
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Número de éxitos (x)" value={form.x} onChange={(e) => setForm((f) => ({ ...f, x: e.target.value }))} help="Entero no negativo" />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
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
// Error estándar genérico
// ---------------------------------------------------------------------------
interface ErrorEstandarForm { tipo: 'media' | 'proporcion'; valor: string; n: string }
const initialErrorEstandarForm: ErrorEstandarForm = { tipo: 'media', valor: '2', n: '36' }

export function ErrorEstandarCalc() {
  const [form, setForm] = useState<ErrorEstandarForm>(initialErrorEstandarForm)
  const [err, setErr] = useState('')
  const [calc, setCalc] = useState<CalcState | null>(null)

  const reset = () => {
    setForm(initialErrorEstandarForm)
    setErr('')
    setCalc(null)
  }

  const handleCalc = () => {
    const valorR = pnum(form.valor, form.tipo === 'media' ? 'Desviación (σ o s)' : 'Proporción (p o p̂)', { positive: true })
    const nR = pnum(form.n, 'Tamaño de muestra (n)', { positive: true, integer: true })
    const errors = [valorR, nR].flatMap((r) => (r?.error ? [r.error!] : []))
    if (errors.length) {
      setErr(errors[0]!)
      setCalc(null)
      return
    }
    setErr('')

    const valor = valorR.value!
    const n = nR.value!
    const se = form.tipo === 'media' ? seMean(valor, n) : seProportion(valor, n)

    const formula = form.tipo === 'media' ? 'SE = σ/√n' : 'SE = √[p(1−p)/n]'
    const resultsText = `SE = ${formatNumber(se, 4)}`
    setCalc({
      result: <StatCard label="Error estándar" value={formatNumber(se, 4)} tone="primary" />,
      development: <StepList formula={formula} steps={[{ label: `Calcular ${form.tipo === 'media' ? 'SE = σ/√n' : 'SE = √[p(1−p)/n]'}`, value: `SE = ${formatNumber(se, 4)}` }]} copyText={resultsText} />,
      interpretation: `El error estándar de ${form.tipo === 'media' ? 'la media' : 'la proporción'} con valor ${formatNumber(valor, 4)} y tamaño de muestra ${n} es ${formatNumber(se, 4)}.`,
      resultsText,
    })
  }

  return (
    <CalculatorLayout
      name="Cálculo del error estándar"
      description="Calcula el error estándar de una media o proporción muestral."
      form={
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Tipo de variable"
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as ErrorEstandarForm['tipo'] }))}
          >
            <option value="media">Media (σ/√n)</option>
            <option value="proporcion">Proporción (√[p(1−p)/n])</option>
          </Select>
          <Input
            label={form.tipo === 'media' ? 'Desviación (σ o s)' : 'Proporción (p o p̂)'}
            value={form.valor}
            onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
            help={form.tipo === 'media' ? 'Desviación estándar de la población o muestra' : 'Proporción poblacional o estimada'}
          />
          <Input label="Tamaño de muestra (n)" value={form.n} onChange={(e) => setForm((f) => ({ ...f, n: e.target.value }))} help="Entero positivo" />
        </div>
      }
      error={err}
      onCalc={handleCalc}
      onClear={reset}
      calc={calc}
    />
  )
}
