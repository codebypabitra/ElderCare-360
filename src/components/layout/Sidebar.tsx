import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Pill, Activity, Bot, AlertTriangle, Users,
  ClipboardList, Bell, Settings, FlaskConical, LogOut, HeartPulse,
  Menu, X, ChevronRight, FileText, Stethoscope
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  patient: [
    { label: 'Dashboard', path: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Medications', path: '/patient/medications', icon: <Pill className="h-5 w-5" /> },
    { label: 'Health Vitals', path: '/patient/health', icon: <Activity className="h-5 w-5" /> },
    { label: 'AI Companion', path: '/patient/assistant', icon: <Bot className="h-5 w-5" /> },
    { label: 'Emergency SOS', path: '/patient/emergency', icon: <AlertTriangle className="h-5 w-5" /> },
  ],
  family: [
    { label: 'Family Hub', path: '/family/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Patient Record', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Care Tasks', path: '/caregiver/tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Health Reports', path: '/reports', icon: <FileText className="h-5 w-5" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
  ],
  caregiver: [
    { label: 'Care Dashboard', path: '/caregiver/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Patient Record', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Task Management', path: '/caregiver/tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
  ],
  doctor: [
    { label: 'Doctor Hub', path: '/doctor/dashboard', icon: <Stethoscope className="h-5 w-5" /> },
    { label: 'Patient Record', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Prescription OCR', path: '/doctor/prescriptions', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Health Reports', path: '/reports', icon: <FileText className="h-5 w-5" /> },
  ],
  admin: [
    { label: 'Admin Hub', path: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  ],
}

const COMMON_NAV: NavItem[] = [
  { label: 'Simulation Lab', path: '/demo', icon: <FlaskConical className="h-5 w-5" /> },
  { label: 'Reports & Analytics', path: '/reports', icon: <FileText className="h-5 w-5" /> },
  { label: 'Settings & Security', path: '/settings', icon: <Settings className="h-5 w-5" /> },
]

export function Sidebar() {
  const { currentUser, logout, getUnreadNotificationCount } = useApp()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!currentUser) return null

  const roleItems = NAV_ITEMS[currentUser.role] || []
  const unreadCount = getUnreadNotificationCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-100">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/20">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            ElderCare <span className="text-blue-600">360</span>
          </h1>
          <p className="text-xs font-medium text-slate-500">Smarter Care · Safer Living</p>
        </div>
      </div>

      {/* User info */}
      <div className="mx-4 my-3 rounded-xl bg-blue-50/60 p-3.5 border border-blue-100/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.full_name}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
        {roleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </NavLink>
        ))}

        <div className="my-3 border-t border-slate-100" />
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Tools & Lab</p>
        {COMMON_NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Switch Account / Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2.5 shadow-md border border-slate-200 lg:hidden text-slate-700"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3.5 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white shrink-0">
        {navContent}
      </aside>
    </>
  )
}
