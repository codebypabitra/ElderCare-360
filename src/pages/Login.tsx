import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Users, Award, Stethoscope, ArrowRight, ShieldCheck,
  Sparkles, CheckCircle2
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
      title: 'Elderly Patient',
      name: 'Ramesh Kumar',
      meta: 'Age 72 · Bhubaneswar, Odisha',
      description: 'Simplified high-contrast interface for medicine checklists, vitals logging, AI companion, and one-tap SOS.',
      icon: HeartPulse,
      badge: 'Primary Recipient',
      color: 'blue',
      features: ['One-tap medication checkoff', 'Large font & voice companion', 'SOS button & fall response'],
    },
    {
      role: 'family' as UserRole,
      title: 'Family Member',
      name: 'Priya Kumar',
      meta: 'Daughter · Working in Bangalore',
      description: 'Remote oversight portal tracking adherence patterns, missed dose escalations, and weekly care metrics.',
      icon: Users,
      badge: 'Care Guardian',
      color: 'indigo',
      features: ['Missed dose alerts in real-time', 'Care Intelligence Score telemetry', 'Emergency contact coordination'],
    },
    {
      role: 'caregiver' as UserRole,
      title: 'Assigned Caregiver',
      name: 'Sunita Devi',
      meta: 'Visiting Senior Care Attendant',
      description: 'Task-driven workflow for daily supervision, vitals verification, and prescription refills.',
      icon: Award,
      badge: 'Field Operations',
      color: 'emerald',
      features: ['Daily scheduled care checklist', 'Direct task status completion', 'Emergency dispatch routing'],
    },
    {
      role: 'doctor' as UserRole,
      title: 'Consulting Physician',
      name: 'Dr. Anil Sharma',
      meta: 'MD, Senior Cardiologist',
      description: 'Clinical oversight dashboard with prescription OCR scanning, health trend analysis, and medication adjustments.',
      icon: Stethoscope,
      badge: 'Clinical Reviewer',
      color: 'purple',
      features: ['Prescription OCR scanner tool', '14-day blood pressure trends', 'Clinical alert thresholds'],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/30 mb-4">
          <HeartPulse className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Select Your Persona
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          ElderCare 360 uses role-based access control. Click any persona below to enter the live system immediately without passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {personas.map(persona => {
            const Icon = persona.icon
            return (
              <div
                key={persona.role}
                onClick={() => handleSelectRole(persona.role)}
                className="group relative bg-white border-2 border-slate-200/90 hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{persona.title}</h3>
                        <p className="text-xs font-semibold text-blue-600">{persona.name}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {persona.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-medium mb-3">{persona.meta}</p>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{persona.description}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
                    {persona.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Enter as {persona.title}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Supabase Auth Ready
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-600" />
            DPDP Compliant RLS Policies
          </span>
        </div>
      </div>
    </div>
  )
}
