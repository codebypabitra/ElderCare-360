import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
  iconBg?: string
}

export function StatCard({ title, value, subtitle, icon, trend, trendValue, className, iconBg = 'bg-primary-100 text-primary-600' }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          {trend && trendValue && (
            <p className={cn(
              'mt-1 text-sm font-medium',
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
