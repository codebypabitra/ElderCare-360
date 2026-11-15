import { cn } from '@/lib/utils'

interface StatusDotProps {
  status: 'online' | 'offline' | 'warning' | 'danger'
  label?: string
  pulse?: boolean
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

export function StatusDot({ status, label, pulse }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {pulse && (
          <span className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            statusColors[status]
          )} />
        )}
        <span className={cn('relative inline-flex h-3 w-3 rounded-full', statusColors[status])} />
      </span>
      {label && <span className="text-sm text-slate-600">{label}</span>}
    </span>
  )
}
