import { cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  label?: string
  color?: string
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  showLabel = true,
  label,
  color,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColor = () => {
    if (color) return color
    if (value >= 90) return '#10b981'
    if (value >= 70) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-slate-900">{Math.round(value)}%</span>
          {label && <span className="text-xs text-slate-500">{label}</span>}
        </div>
      )}
    </div>
  )
}
