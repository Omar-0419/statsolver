import { Card } from '@/components/ui/Card'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { StepList } from '@/components/calculators/shared/StepList'
import { getProcedure } from '@/lib/solver/procedure-map'

interface SolverStagesProps {
  requested: string
  unitName: string
  procedureId: string
}

export function SolverStages({ requested, unitName, procedureId }: SolverStagesProps) {
  const procedure = getProcedure(procedureId)
  const Comp = procedure?.component

  const steps = [
    { label: '¿Qué solicita el ejercicio?', value: requested },
    { label: '¿Qué unidad corresponde?', value: unitName },
    {
      label: '¿Qué procedimiento estadístico se debe utilizar?',
      value: procedure ? `${procedure.name} — ${procedure.description}` : 'No definido',
    },
    { label: 'Fórmula aplicada', value: procedure?.formula ?? 'Sin procedimiento definido' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <SectionTitle
          title="Etapa 1 — Identificación del problema"
          subtitle="¿Qué solicita el ejercicio? ¿Qué unidad corresponde? ¿Qué procedimiento se debe usar?"
        />
        <StepList steps={steps} copyText={steps.map((s) => `${s.label}: ${s.value}`).join('\n')} />
      </Card>

      <Card>
        <SectionTitle
          title="Etapa 2 — Identificación de datos"
          subtitle="Variables, valores conocidos, valores desconocidos y parámetros"
        />
        <StepList
          steps={[
            { label: 'Variables', value: 'Revisa la tabla de variables de la calculadora de abajo' },
            { label: 'Valores conocidos', value: 'Valores numéricos detectados o ingresados en la calculadora' },
            { label: 'Valores desconocidos', value: 'Datos que deben ser calculados con la calculadora' },
          ]}
        />
      </Card>

      <Card>
        <SectionTitle title="Etapa 3 — Selección de fórmula" subtitle="Fórmula estadística y explicación de su utilización" />
        <StepList
          steps={[
            { label: 'Fórmula aplicada', value: procedure?.formula ?? 'Sin procedimiento definido' },
            { label: 'Explicación de su utilización', value: `${procedure ? procedure.name : 'No definido'}: ${procedure ? procedure.description : ''}` },
          ]}
        />
      </Card>

      {Comp ? (
        <Card>
          <SectionTitle
            title="Etapa 4 — Desarrollo"
            subtitle="Sustitución de valores, operaciones matemáticas y resultados intermedios"
          />
          <Comp />
        </Card>
      ) : null}

      <Card>
        <SectionTitle title="Etapa 5 — Resultado final" subtitle="Resultado numérico, interpretación y conclusión" />
        <p className="text-sm text-ss-muted">
          Consulta el resultado numérico, la interpretación y la conclusión en la calculadora de abajo; pulsa el
          botón “Copiar” para copiar los resultados.
        </p>
      </Card>
    </div>
  )
}
