import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function calculateAdherence(taken: number, total: number): number {
  if (total === 0) return 100
  return Math.round((taken / total) * 100)
}

export function getAdherenceColor(adherence: number): string {
  if (adherence >= 90) return 'text-emerald-600'
  if (adherence >= 70) return 'text-amber-600'
  return 'text-red-600'
}

export function getAdherenceBgColor(adherence: number): string {
  if (adherence >= 90) return 'bg-emerald-50'
  if (adherence >= 70) return 'bg-amber-50'
  return 'bg-red-50'
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
