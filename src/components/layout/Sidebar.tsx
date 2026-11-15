import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Pill, Activity, Bot, AlertTriangle, Users,
  ClipboardList, Bell, Settings, FlaskConical, LogOut, HeartPulse,
  Menu, X, ChevronRight, FileText, Stethoscope, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  hindiLabel: string
  path: string
  icon: React.ReactNode
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  patient: [
    { label: 'Seva Dashboard', hindiLabel: 'सेवा डैशबोर्ड', path: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Dawai Schedule', hindiLabel: 'दवाइयाँ', path: '/patient/medications', icon: <Pill className="h-5 w-5" /> },
    { label: 'Swasthya Vitals', hindiLabel: 'स्वास्थ्य स्थिति', path: '/patient/health', icon: <Activity className="h-5 w-5" /> },
    { label: 'AI Sahayak', hindiLabel: 'एआई सहायक (ଓଡ଼ିଆ)', path: '/patient/assistant', icon: <Bot className="h-5 w-5" /> },
    { label: 'Aapatkaalin SOS', hindiLabel: 'आपातकालीन सहायता', path: '/patient/emergency', icon: <AlertTriangle className="h-5 w-5" /> },
  ],
  family: [
    { label: 'Parivaar Hub', hindiLabel: 'परिवार डैशबोर्ड', path: '/family/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Patient Record', hindiLabel: 'पिताजी का स्वास्थ्य', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Seva Tasks', hindiLabel: 'देखभाल कार्य', path: '/caregiver/tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Health Reports', hindiLabel: 'स्वास्थ्य पत्रिका', path: '/reports', icon: <FileText className="h-5 w-5" /> },
    { label: 'Notifications', hindiLabel: 'सूचनाएं', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
  ],
  caregiver: [
    { label: 'Attendant Dashboard', hindiLabel: 'सहायक सेवा', path: '/caregiver/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Patient Record', hindiLabel: 'मरीज़ रिकॉर्ड', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Duty Tasks', hindiLabel: 'दैनिक कार्य', path: '/caregiver/tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Notifications', hindiLabel: 'अलर्ट', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
  ],
  doctor: [
    { label: 'Doctor Hub', hindiLabel: 'चिकित्सक पोर्टल', path: '/doctor/dashboard', icon: <Stethoscope className="h-5 w-5" /> },
    { label: 'Patient Chart', hindiLabel: 'मरीज़ चार्ट', path: '/family/patient/patient-001', icon: <Users className="h-5 w-5" /> },
    { label: 'Prescription OCR', hindiLabel: 'पर्चा स्कैनर (AI)', path: '/doctor/prescriptions', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Clinical Reports', hindiLabel: 'क्लिनिकल रिपोर्ट्स', path: '/reports', icon: <FileText className="h-5 w-5" /> },
  ],
  admin: [
    { label: 'Admin Hub', hindiLabel: 'प्रबंधन', path: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  ],
}

const COMMON_NAV: NavItem[] = [
  { label: 'Simulation Lab', hindiLabel: 'परीक्षण लैब', path: '/demo', icon: <FlaskConical className="h-5 w-5" /> },
  { label: 'Swasthya Reports', hindiLabel: 'स्वास्थ्य रिपोर्ट', path: '/reports', icon: <FileText className="h-5 w-5" /> },
  { label: 'Settings & Ayush', hindiLabel: 'सेटिंग्स व सुरक्षा', path: '/settings', icon: <Settings className="h-5 w-5" /> },
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

  // Friendly Indian role titles
  const roleDisplayNames: Record<UserRole, { title: string; subtitle: string }> = {
    patient: { title: 'Ramesh Kumar Ji', subtitle: 'Elderly Senior · ବୟୋଜ୍ୟେଷ୍ଠ' },
    family: { title: 'Priya Kumar', subtitle: 'Daughter / Guardian · ସୁରକ୍ଷା' },
    caregiver: { title: 'Sunita Devi', subtitle: 'Senior Care Attendant · ସେବିକା' },
    doctor: { title: 'Dr. Anil Sharma', subtitle: 'Cardiologist · ଚିକିତ୍ସକ' },
    admin: { title: 'Admin', subtitle: 'Coordinator' },
  }

  const roleInfo = roleDisplayNames[currentUser.role] || { title: currentUser.full_name, subtitle: currentUser.role }

  const navContent = (
    <div className="flex h-full flex-col bg-[#FAF8F5] border-r border-[#EAE3D8] text-[#1C1917]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EAE3D8] bg-[#FAF8F5]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C2410C] via-[#EA580C] to-[#F59E0B] text-white shadow-md shadow-[#EA580C]/20 shrink-0">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-[#1C1917] font-serif">
                ElderCare <span className="text-[#C2410C]">360</span>
              </h1>
            </div>
            <p className="text-[11px] font-semibold text-[#78716C] tracking-wide">
              Smarter Seva · Connected Parivaar
            </p>
          </div>
        </div>
      </div>

      {/* User Indian Identity Card */}
      <div className="mx-4 my-3.5 rounded-2xl bg-white p-3.5 border border-[#EAE3D8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEDD5] text-[#9A3412] font-black text-sm border border-[#FED7AA] shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1C1917] truncate">{roleInfo.title}</p>
            <p className="text-[11px] text-[#78716C] font-medium truncate">{roleInfo.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#A8A29E]">
          MUKHYA KARYA (MAIN)
        </p>

        {roleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-[#1C1917] text-white shadow-sm'
                : 'text-[#44403C] hover:bg-[#F5F1EB] hover:text-[#1C1917]'
            )}
          >
            {item.icon}
            <div className="flex flex-col text-left leading-tight">
              <span>{item.label}</span>
              <span className="text-[10px] opacity-75 font-normal">{item.hindiLabel}</span>
            </div>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
            <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
          </NavLink>
        ))}

        <div className="my-3.5 border-t border-[#EAE3D8]" />
        <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#A8A29E]">
          LAB & REPORTS
        </p>

        {COMMON_NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-[#1C1917] text-white shadow-sm'
                : 'text-[#44403C] hover:bg-[#F5F1EB] hover:text-[#1C1917]'
            )}
          >
            {item.icon}
            <div className="flex flex-col text-left leading-tight">
              <span>{item.label}</span>
              <span className="text-[10px] opacity-75 font-normal">{item.hindiLabel}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Cultural Footer & Logout */}
      <div className="border-t border-[#EAE3D8] p-3.5 bg-[#FAF8F5]">
        <div className="mb-2 text-center text-[10px] text-[#A8A29E] font-medium">
          ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FCA5A5] transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Switch Persona / Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2.5 shadow-md border border-[#EAE3D8] lg:hidden text-[#1C1917]"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#1C1917]/40 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-[#FAF8F5] shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3.5 top-4 rounded-lg p-1.5 text-[#78716C] hover:bg-[#EAE3D8]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col shrink-0">
        {navContent}
      </aside>
    </>
  )
}
