import type { ComponentType } from 'react'
import {
  BarChart3,
  Book,
  BookOpen,
  Calculator,
  House,
  Info,
  PieChart,
  Sigma,
  TrendingUp,
} from 'lucide-react'

export interface NavSection {
  label: string
  href: string
  description?: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
}

export const navSections: NavSection[] = [
  { label: 'Inicio', href: '/', description: 'Dashboard principal', icon: House },
  { label: 'Unidad 1', href: '/unidad-1', description: 'Distribuciones muestrales', icon: BookOpen },
  { label: 'Unidad 2', href: '/unidad-2', description: 'Estimación y muestreo', icon: BarChart3 },
  { label: 'Unidad 3', href: '/unidad-3', description: 'Intervalos de confianza', icon: PieChart },
  { label: 'Unidad 4', href: '/unidad-4', description: 'Pruebas de hipótesis', icon: TrendingUp },
  { label: 'Calculadoras', href: '/calculadoras', description: 'Calculadoras estadísticas', icon: Calculator },
  { label: 'Casos de estudio', href: '/casos-estudio', description: 'Biblioteca de casos prácticos', icon: Book },
  { label: 'Solucionador', href: '/solucionador', description: 'Resolución de problemas', icon: Sigma },
  { label: 'Acerca del proyecto', href: '/acerca', description: 'Sobre STAT SOLVER', icon: Info },
]
