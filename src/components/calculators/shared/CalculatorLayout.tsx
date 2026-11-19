import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { CopyButton } from '@/components/ui/CopyButton'

export interface CalculatorLayoutProps {
  name: string
  description: string
  form: ReactNode
  calc?: {
    result?: ReactNode
    development?: ReactNode
    interpretation?: string
    resultsText?: string
    chart?: ReactNode
  } | null
  error?: string
  onCalc?: () => void
  onClear?: () => void
}

export function CalculatorLayout({ name, description, form, calc, error, onCalc, onClear }: CalculatorLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col gap-5">
          <SectionTitle title={name} subtitle={description} />
          {form}
          <div className="flex flex-wrap gap-3">
            {onCalc ? (
              <Button onClick={onCalc} size="lg">
                Calcular
              </Button>
            ) : null}
            {onClear ? (
              <Button variant="secondary" onClick={onClear} size="lg">
                Limpiar
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="border-ss-danger/20 bg-ss-danger-muted/40">
          <p className="text-sm font-medium text-ss-danger">{error}</p>
        </Card>
      ) : null}

      {calc?.result ? (
        <Card>
          <div className="flex items-center justify-between gap-4">
            <SectionTitle title="Resultados" />
            {calc.resultsText ? <CopyButton value={calc.resultsText} /> : null}
          </div>
          <div className="mt-4 flex flex-col gap-3">{calc.result}</div>
        </Card>
      ) : null}

      {calc?.chart ? (
        <Card className="bg-ss-surface-elevated/40">
          <div className="mx-auto max-w-2xl">{calc.chart}</div>
        </Card>
      ) : null}

      {calc?.development ? (
        <Card>
          <SectionTitle title="Desarrollo matemático paso a paso" />
          <div className="mt-4">{calc.development}</div>
        </Card>
      ) : null}

      {calc?.interpretation ? (
        <Card>
          <div className="flex items-center justify-between gap-4">
            <SectionTitle title="Interpretación" subtitle="Significado estadístico de los resultados" />
            {calc.resultsText ? <CopyButton value={calc.resultsText} className="ml-auto" /> : null}
          </div>
          <p className="mt-2 text-ss-fg leading-7">{calc.interpretation}</p>
        </Card>
      ) : null}
    </div>
  )
}
