import { notFound } from 'next/navigation'
import { StudyCaseDetail } from '@/components/study-cases/StudyCaseDetail'
import { studyCases } from '@/lib/data/study-cases'

export function generateStaticParams() {
  return studyCases.map((c) => ({ id: c.id }))
}

export default async function CasePage({ params }: PageProps<'/casos-estudio/[id]'>) {
  const { id } = await params
  const found = studyCases.find((c) => c.id === id)
  if (!found) notFound()
  return <StudyCaseDetail studyCase={found} />
}
