'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CopyButton } from '@/components/ui/CopyButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Textarea } from '@/components/ui/Textarea'
import { StepList } from '@/components/calculators/shared/StepList'
import { UNIT_NAMES } from '@/lib/solver/patterns'
import type { StudyCase } from '@/lib/data/study-cases'

export function StudyCaseDetail({ studyCase }: { studyCase: StudyCase }) {
  const [showSolution, setShowSolution] = useState(false)
  const [data, setData] = useState(studyCase.datos)

  const copyText = [
    `Caso: ${studyCase.title}`,
    `Unidad: ${UNIT_NAMES[studyCase.unit - 1]} (${studyCase.dificultad})`,
    `Enunciado: ${studyCase.enunciado}`,
    `Datos: ${data}`,
    `Objetivo: ${studyCase.objetivo}`,
    `Procedimiento sugerido: ${studyCase.referencia.procedureId}`,
    `Respuesta de referencia: ${studyCase.referencia.resultado}`,
    `Interpretación: ${studyCase.referencia.interpretacion}`,
  ].join('\n')

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle
        title={studyCase.title}
        subtitle={`${UNIT_NAMES[studyCase.unit - 1]} — ${studyCase.tipo} — ${studyCase.dificultad}`}
      />

      <Card>
        <SectionTitle title="Contexto" subtitle="Situación realista del problema" />
        <p className="text-ss-muted">{studyCase.contexto}</p>
      </Card>

      <Card>
        <SectionTitle title="Enunciado" subtitle="Problema a resolver" />
        <StepList steps={[{ label: 'Enunciado', value: studyCase.enunciado }]} />
      </Card>

      <Card>
        <SectionTitle title="Datos del problema" subtitle="Introducir o revisar los datos" />
        <Textarea
          label="Datos numéricos y variables del caso"
          value={data}
          onChange={(e) => setData(e.target.value)}
          help="Revisa que los valores coincidan con el enunciado"
        />
      </Card>

      <Card>
        <SectionTitle title="Objetivo" subtitle="¿Qué se debe calcular o decidir?" />
        <p className="text-ss-fg">{studyCase.objetivo}</p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button href="/solucionador">Resolver mediante el solucionador</Button>
        <Button variant="secondary" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? 'Ocultar solución' : 'Consultar solución explicada'}
        </Button>
        <CopyButton value={copyText} label="detalle del caso" />
      </div>

      {showSolution ? <StudyCaseSolution studyCase={studyCase} /> : null}
    </div>
  )
}

function StudyCaseSolution({ studyCase }: { studyCase: StudyCase }) {
  const ref = studyCase.referencia
  const steps = ref.steps.map((s, i) => ({ label: `Etapa ${i + 1}`, value: s }))
  return (
    <Card>
      <SectionTitle
        title="Solución explicada (referencia)"
        subtitle="Procedimiento, respuesta y comparación con el solucionador"
      />
      <StepList
        formula={ref.ficha.fórmula}
        steps={steps}
        copyText={[
          ...steps.map((s) => `${s.label}: ${s.value}`),
          `Resultado: ${ref.resultado}`,
          `Interpretación: ${ref.interpretacion}`,
          ...(ref.comparar ? [`Comparación: ${ref.comparar}`] : []),
        ].join('\n')}
      />
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ss-muted">Resultado</p>
        <p className="text-ss-fg">{ref.resultado}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ss-muted">Interpretación</p>
        <p className="text-ss-fg">{ref.interpretacion}</p>
        {ref.comparar ? (
          <>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ss-muted">Comparación</p>
            <p className="text-ss-fg">{ref.comparar}</p>
          </>
        ) : null}
      </div>
    </Card>
  )
}
