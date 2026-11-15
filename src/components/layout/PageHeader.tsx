import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  badge?: React.ReactNode
}

export function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-sm sm:text-base text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  )
}
