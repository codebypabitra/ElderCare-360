import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-400',
              icon && 'pl-10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
