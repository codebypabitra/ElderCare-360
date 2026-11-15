import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Pill, Activity, ShieldAlert, Users, Bot,
  ArrowRight, CheckCircle2, Sparkles, Smartphone, Award, Stethoscope, Radio
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

export default function Landing() {
  const { login } = useApp()
  const navigate = useNavigate()

  const handleQuickLogin = (role: UserRole) => {
    login(role)
    if (role === 'patient') navigate('/patient/dashboard')
    else if (role === 'family') navigate('/family/dashboard')
    else if (role === 'caregiver') navigate('/caregiver/dashboard')
    else if (role === 'doctor') navigate('/doctor/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                ElderCare <span className="text-blue-600">360</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                Hackathon Blueprint Edition
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                login('patient')
                navigate('/demo')
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-600" />
              Live Simulation Lab
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              Access Portal
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 font-semibold text-xs mb-6 border border-blue-200/60 shadow-xs">
              <Radio className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              AI-Powered Preventive Elderly Care Ecosystem
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight sm:leading-none">
              Smarter Care. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Safer Living.
              </span>{' '}
              Connected Families.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Not just another reminder app — an integrated care engine unifying medication adherence,
              continuous vital telemetry, simulated fall escalation, and multi-lingual regional AI support
              for seniors and their care circles.
            </p>

            {/* Role Demo Quick Launchers */}
            <div className="mt-10 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
                Explore The Working Ecosystem — Select A Role To Launch Instantly
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleQuickLogin('patient')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-blue-200 bg-blue-50/60 hover:bg-blue-100 hover:border-blue-400 text-slate-800 font-bold transition-all group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-blue-950">Mr. Ramesh</span>
                  <span className="text-xs text-blue-600 font-medium">Elderly Patient</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('family')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 hover:border-indigo-400 text-slate-800 font-bold transition-all group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-indigo-950">Priya Kumar</span>
                  <span className="text-xs text-indigo-600 font-medium">Family Caregiver</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('caregiver')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 hover:border-emerald-400 text-slate-800 font-bold transition-all group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-emerald-950">Sunita Devi</span>
                  <span className="text-xs text-emerald-600 font-medium">Nurse / Attendant</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('doctor')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-purple-200 bg-purple-50/60 hover:bg-purple-100 hover:border-purple-400 text-slate-800 font-bold transition-all group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-purple-950">Dr. Anil Sharma</span>
                  <span className="text-xs text-purple-600 font-medium">Cardiologist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Pillars Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 mb-2">
              Five Core Innovation Pillars
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Engineered To Address Senior Vulnerabilities
            </p>
            <p className="mt-3 text-slate-500 text-base">
              Connecting daily medication, biometrics, family alerts, and regional AI support into a single closed-loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 font-bold">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Medication Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Automated scheduling, missed-dose escalation rules, stock refill telemetry, and dose verification logs with zero guesswork.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <CheckCircle2 className="h-4 w-4" /> Grace period escalation protocol
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 font-bold">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Health Vitals Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Tracks blood pressure, SpO2, heart rate, blood glucose, and temperature with clinical thresholds and multi-day trend graphs.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Configurable abnormal limits
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-300 hover:shadow-lg hover:shadow-red-500/5 transition-all">
              <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-5 font-bold">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency SOS & Fall Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Single-touch distress siren and simulated accelerometer fall detector with interactive 30s confirmation countdown and family escalation.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                <CheckCircle2 className="h-4 w-4" /> Multi-tier emergency broadcasting
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Connected Care Circle</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Coordinates elderly patients with remote children, visiting attendants, and consulting physicians through shared task boards.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <CheckCircle2 className="h-4 w-4" /> Role-based access & DPDP compliance
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 font-bold">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Regional AI Companion</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Context-aware conversational assistant grounded in the patient's records. Supports English, Hindi, and Odia voice instructions.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                <CheckCircle2 className="h-4 w-4" /> Odia (ଓଡ଼ିଆ) + Hindi speech synthesis
              </div>
            </div>

            {/* Pillar 6 - The differentiator */}
            <div className="p-7 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/50 to-orange-50/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Care Intelligence Engine™</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                The composite scoring algorithm synthesizing adherence (40%), pending tasks (25%), open alerts (20%), and telemetry freshness (15%).
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                <CheckCircle2 className="h-4 w-4" /> Transparent evidence-backed scoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Live Demo Call to Action */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Hackathon Simulation Ready
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
                Ready to review live events & emergency scenarios?
              </h2>
              <p className="text-slate-400 mt-2 max-w-xl text-base">
                Use our built-in Simulation Lab to fire simulated falls, trigger missed doses, inject abnormal blood pressure readings, and observe system reactions in real-time.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  login('patient')
                  navigate('/demo')
                }}
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all"
              >
                Launch Simulation Lab
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                Switch Login Persona
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-white">
        <p className="font-semibold text-slate-700">ElderCare 360 · Innovation-Focused Execution Blueprint</p>
        <p className="mt-1">Designed for Hackathons & DPDP India Alignment · Multi-Role Autonomous Coordination</p>
      </footer>
    </div>
  )
}
