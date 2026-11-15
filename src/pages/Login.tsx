import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Users, Award, Stethoscope, ArrowRight, ShieldCheck,
  Sparkles, CheckCircle2, Heart
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()

  const handleSelectRole = (role: UserRole) => {
    login(role)
    if (role === 'patient') navigate('/patient/dashboard')
    else if (role === 'family') navigate('/family/dashboard')
    else if (role === 'caregiver') navigate('/caregiver/dashboard')
    else if (role === 'doctor') navigate('/doctor/dashboard')
  }

  const personas = [
    {
      role: 'patient' as UserRole,
      title: 'Senior Citizen Patient',
      hindiTitle: 'वरिष्ठ नागरिक (मरीज़)',
      name: 'Ramesh Kumar Ji (Age 72)',
      meta: 'Bhubaneswar, Odisha · ବୟୋଜ୍ୟେଷ୍ଠ',
      description: 'Simplified high-contrast interface designed for elders with large touch targets, daily pill checklist, and Odia voice companion.',
      icon: Heart,
      badge: 'Primary Recipient',
      accentBg: 'bg-[#FFF7ED]',
      accentBorder: 'border-[#FED7AA]',
      iconBg: 'bg-[#EA580C] text-white',
      badgeClass: 'bg-[#FFEDD5] text-[#9A3412]',
      features: ['One-tap medication checkoff', 'Large font & Odia voice assistant', '1-click Emergency SOS & fall sensor'],
    },
    {
      role: 'family' as UserRole,
      title: 'Remote Family Member',
      hindiTitle: 'पारिवारिक अभिभावक',
      name: 'Priya Kumar (Daughter)',
      meta: 'Working in Bengaluru · ସୁରକ୍ଷା',
      description: 'Remote peace-of-mind portal tracking adherence patterns, missed dose escalations, and weekly care metrics.',
      icon: Users,
      badge: 'Family Guardian',
      accentBg: 'bg-white',
      accentBorder: 'border-[#EAE3D8]',
      iconBg: 'bg-[#1C1917] text-white',
      badgeClass: 'bg-[#F5F1EB] text-[#44403C]',
      features: ['Missed dose alerts in real time', 'Care Intelligence Score telemetry', 'Emergency contact coordination'],
    },
    {
      role: 'caregiver' as UserRole,
      title: 'Senior Care Attendant',
      hindiTitle: 'देखभाल सहायक (सेविका)',
      name: 'Sunita Devi (Attendant)',
      meta: 'Visiting Senior Care Attendant · ସେବିକା',
      description: 'Task-driven workflow for daily supervision, vitals verification, and prescription refills.',
      icon: Award,
      badge: 'Seva Attendant',
      accentBg: 'bg-[#ECFDF5]/50',
      accentBorder: 'border-[#A7F3D0]',
      iconBg: 'bg-[#059669] text-white',
      badgeClass: 'bg-[#D1FAE5] text-[#065F46]',
      features: ['Daily scheduled care checklist', 'Direct task status completion', 'Emergency dispatch routing'],
    },
    {
      role: 'doctor' as UserRole,
      title: 'Consulting Physician',
      hindiTitle: 'परामर्श चिकित्सक',
      name: 'Dr. Anil Sharma (MD)',
      meta: 'Cardiology Specialist · ଚିକିତ୍ସକ',
      description: 'Clinical oversight dashboard with prescription OCR scanning, health trend analysis, and medication adjustments.',
      icon: Stethoscope,
      badge: 'Clinical Reviewer',
      accentBg: 'bg-[#F0FDFA]/50',
      accentBorder: 'border-[#CCFBF1]',
      iconBg: 'bg-[#0F766E] text-white',
      badgeClass: 'bg-[#CCFBF1] text-[#115E59]',
      features: ['Prescription OCR scanner tool', '14-day blood pressure trends', 'Clinical alert thresholds'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-16 sm:px-6 lg:px-8 text-[#1C1917]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C2410C] via-[#EA580C] to-[#F59E0B] text-white shadow-md shadow-[#EA580C]/20 mb-4">
          <HeartPulse className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#1C1917] tracking-tight font-serif">
          Select Your Persona
        </h2>
        <p className="mt-2 text-sm text-[#78716C] leading-relaxed">
          ElderCare 360 uses role-based access control. Click any persona below to enter the live ecosystem immediately without passwords.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {personas.map(persona => {
            const Icon = persona.icon
            return (
              <div
                key={persona.role}
                onClick={() => handleSelectRole(persona.role)}
                className={`group relative ${persona.accentBg} border-2 ${persona.accentBorder} hover:border-[#C2410C] rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-2xl ${persona.iconBg} flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1C1917] leading-tight">{persona.title}</h3>
                        <p className="text-xs text-[#78716C] font-normal">{persona.hindiTitle}</p>
                        <p className="text-xs font-bold text-[#C2410C] mt-0.5">{persona.name}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${persona.badgeClass}`}>
                      {persona.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#A8A29E] font-medium mb-3">{persona.meta}</p>
                  <p className="text-xs text-[#57534E] mb-4 leading-relaxed">{persona.description}</p>

                  <div className="space-y-1.5 pt-3 border-t border-[#EAE3D8] mb-4">
                    {persona.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#57534E]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#292524] border border-[#EAE3D8] group-hover:bg-[#1C1917] group-hover:text-white group-hover:border-[#1C1917] transition-all flex items-center justify-center gap-2"
                >
                  Enter as {persona.name.split(' ')[0]}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center flex items-center justify-center gap-6 text-xs text-[#78716C]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-[#059669]" />
            Ayush & DPDP Act 2023 India Aligned
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-4 w-4 text-[#EA580C]" />
            Real-Time Cloud Synchronization
          </span>
        </div>
      </div>
    </div>
  )
}
