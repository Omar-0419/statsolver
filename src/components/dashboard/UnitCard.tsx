import Link from 'next/link'
import type { ComponentType } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type UnitCardProps = {
  id: string
  title: string
  path: string
  description: string
  topics: string[]
  icon: ComponentType<{ className?: string }>
  difficulty: 'Introductorio' | 'Intermedio'
}

export function UnitCard({ title, path, description, topics, icon: Icon, difficulty }: UnitCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="rounded-lg bg-ss-primary-muted p-2.5 text-ss-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ss-fg">{title}</h3>
            <Badge variant={difficulty === 'Introductorio' ? 'success' : 'primary'} className="mt-1">
              {difficulty}
            </Badge>
          </div>
        </div>
        <Link href={path} className="text-ss-muted hover:text-ss-fg">
          →
        </Link>
      </div>
      <p className="text-sm text-ss-muted">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {topics.map((topic) => (
          <span key={topic} className="rounded-md border border-ss-border px-2 py-0.5 text-xs text-ss-muted">
            {topic}
          </span>
        ))}
      </div>
      <Button href={path} variant="secondary" className="mt-auto justify-center">
        Entrar a la unidad
      </Button>
    </Card>
  )
}
