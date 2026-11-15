import { useNavigate } from 'react-router-dom'
import {
  HeartPulse, Pill, Activity, ShieldAlert, Users, Bot,
  ArrowRight, CheckCircle2, Sparkles, Award, Stethoscope, Radio, Heart
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Top Navbar */}
      <nav className="border-b border-[#EAE3D8] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#C2410C] via-[#EA580C] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20 shrink-0">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#1C1917] font-serif">
                ElderCare <span className="text-[#C2410C]">360</span>
              </span>
              <span className="hidden sm:inline-block ml-3 text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-bold border border-[#FED7AA]">
                Ayush & DPDP Compliant · ଭାରତୀୟ ସେବା
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                login('patient')
                navigate('/demo')
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#44403C] border border-[#EAE3D8] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#EA580C]" />
              Simulation Lab (Judge Hub)
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1C1917] text-white hover:bg-[#292524] transition-all cursor-pointer shadow-sm"
            >
              Enter Portal
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Claude Style Editorial Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEDD5] text-[#9A3412] font-bold text-xs mb-8 border border-[#FED7AA]">
            <Radio className="h-3.5 w-3.5 text-[#EA580C] animate-pulse" />
            Empowering Seniors & Connecting Indian Families Across Cities
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1C1917] tracking-tight leading-[1.1] font-serif">
            Smarter Seva. <br />
            <span className="text-[#C2410C] italic font-serif">Safer Living.</span> <br />
            Connected Parivaar.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-[#57534E] leading-relaxed max-w-3xl mx-auto font-normal">
            An AI-powered preventive healthcare ecosystem unifying daily medication adherence,
            vital telemetry, simulated fall detection, and regional voice assistance in
            <strong className="text-[#1C1917]"> English, हिन्दी, and ଓଡ଼ିଆ</strong> for Indian seniors living alone.
          </p>

          {/* Persona Demo Launchers */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE3D8] shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#A8A29E]">
                  Interactive Ecosystem Roles — Select Any Persona to Enter
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Experience how the same patient record connects across all four roles in real time.
                </p>
              </div>
              <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0] shrink-0">
                ⚡ Supabase Realtime Telemetry Connected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Persona 1: Ramesh Ji */}
              <div
                onClick={() => handleQuickLogin('patient')}
                className="p-5 rounded-2xl border-2 border-[#FED7AA] bg-[#FFF7ED]/50 hover:bg-[#FFF7ED] hover:border-[#EA580C] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412]">
                      Senior Patient
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1C1917]">Ramesh Kumar Ji</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Age 72 · Bhubaneswar, Odisha</p>
                  <p className="text-xs text-[#57534E] mt-3 leading-relaxed">
                    Simplified interface with large buttons, daily pill checklist, and Odia voice companion.
                  </p>
                </div>
                <button className="mt-4 w-full py-2 rounded-xl bg-white border border-[#FED7AA] text-[#9A3412] text-xs font-bold flex items-center justify-center gap-1 group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                  Enter as Ramesh Ji <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Persona 2: Priya */}
              <div
                onClick={() => handleQuickLogin('family')}
                className="p-5 rounded-2xl border-2 border-[#EAE3D8] bg-white hover:bg-[#FAF8F5] hover:border-[#292524] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-[#1C1917] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F1EB] text-[#44403C]">
                      Remote Family
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1C1917]">Priya Kumar</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Daughter · Bengaluru Tech</p>
                  <p className="text-xs text-[#57534E] mt-3 leading-relaxed">
                    Remote peace-of-mind portal tracking missed doses, Care Intelligence Score, and vitals.
                  </p>
                </div>
                <button className="mt-4 w-full py-2 rounded-xl bg-[#F5F1EB] text-[#292524] text-xs font-bold flex items-center justify-center gap-1 group-hover:bg-[#1C1917] group-hover:text-white transition-colors">
                  Enter as Priya <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Persona 3: Sunita */}
              <div
                onClick={() => handleQuickLogin('caregiver')}
                className="p-5 rounded-2xl border-2 border-[#A7F3D0] bg-[#ECFDF5]/50 hover:bg-[#ECFDF5] hover:border-[#059669] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-[#059669] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46]">
                      Seva Attendant
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1C1917]">Sunita Devi</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">Elder Care Assistant</p>
                  <p className="text-xs text-[#57534E] mt-3 leading-relaxed">
                    Daily shift checklist for morning medicine supervision, BP recording, and walk assistance.
                  </p>
                </div>
                <button className="mt-4 w-full py-2 rounded-xl bg-white border border-[#A7F3D0] text-[#065F46] text-xs font-bold flex items-center justify-center gap-1 group-hover:bg-[#059669] group-hover:text-white transition-colors">
                  Enter as Sunita <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Persona 4: Dr. Sharma */}
              <div
                onClick={() => handleQuickLogin('doctor')}
                className="p-5 rounded-2xl border-2 border-[#CCFBF1] bg-[#F0FDFA]/50 hover:bg-[#F0FDFA] hover:border-[#0F766E] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59]">
                      Cardiologist
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#1C1917]">Dr. Anil Sharma</h4>
                  <p className="text-xs text-[#78716C] mt-0.5">MD, Senior Physician</p>
                  <p className="text-xs text-[#57534E] mt-3 leading-relaxed">
                    AI prescription OCR extractor, 14-day cardiovascular curves, and clinical safety thresholds.
                  </p>
                </div>
                <button className="mt-4 w-full py-2 rounded-xl bg-white border border-[#CCFBF1] text-[#115E59] text-xs font-bold flex items-center justify-center gap-1 group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                  Enter as Dr. Anil <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Section */}
      <section className="py-20 border-t border-[#EAE3D8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C2410C]">
              Panch-Sutra Framework
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight font-serif mt-2">
              Five Core Innovations for Elderly Care
            </h2>
            <p className="mt-3 text-[#78716C] text-base">
              Engineered for the realities of Indian nuclear families with aging parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: Dawai Niyam */}
            <div className="p-7 rounded-3xl border border-[#EAE3D8] bg-[#FAF8F5] hover:border-[#FED7AA] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center mb-5 font-bold">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">1. Dawai Niyam (Medication Intelligence)</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Schedules mapped to Indian eating routines (Naashta, Dophar, Raatri Bhojan) with automated grace periods and missed dose escalations.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#9A3412]">
                <CheckCircle2 className="h-4 w-4 text-[#EA580C]" /> Zero-guesswork dose verification
              </div>
            </div>

            {/* Pillar 2: Swasthya Telemetry */}
            <div className="p-7 rounded-3xl border border-[#EAE3D8] bg-[#FAF8F5] hover:border-[#A7F3D0] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#D1FAE5] text-[#065F46] flex items-center justify-center mb-5 font-bold">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">2. Swasthya Vitals Telemetry</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Continuous tracking of Blood Pressure, SpO2, Heart Rate, and Blood Glucose plotted against ICMR and cardiologist-approved thresholds.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#065F46]">
                <CheckCircle2 className="h-4 w-4 text-[#059669]" /> Multi-day physiological trend curves
              </div>
            </div>

            {/* Pillar 3: Aapatkaalin SOS */}
            <div className="p-7 rounded-3xl border border-[#EAE3D8] bg-[#FAF8F5] hover:border-[#FECACA] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center mb-5 font-bold">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">3. Aapatkaalin SOS & Fall Detection</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Single-touch priority distress broadcast and simulated accelerometer fall detector with a 15-second safety confirmation countdown.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B]">
                <CheckCircle2 className="h-4 w-4 text-[#DC2626]" /> Multi-tier caregiver emergency cascade
              </div>
            </div>

            {/* Pillar 4: Parivaar Seva */}
            <div className="p-7 rounded-3xl border border-[#EAE3D8] bg-[#FAF8F5] hover:border-[#EAE3D8] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#F5F1EB] text-[#292524] flex items-center justify-center mb-5 font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">4. Parivaar & Care Circle Hub</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Connects senior parents, out-of-town working children, visiting attendants, and consulting doctors with DPDP-compliant consent.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#292524]">
                <CheckCircle2 className="h-4 w-4 text-[#78716C]" /> Digital Personal Data Protection (India)
              </div>
            </div>

            {/* Pillar 5: Regional AI Sahayak */}
            <div className="p-7 rounded-3xl border border-[#EAE3D8] bg-[#FAF8F5] hover:border-[#CCFBF1] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#CCFBF1] text-[#115E59] flex items-center justify-center mb-5 font-bold">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">5. Regional AI Sahayak (ଓଡ଼ିଆ/हिन्दी)</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Context-aware conversational companion grounded strictly in the patient's records. Supports spoken Odia and Hindi with text-to-speech.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#115E59]">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E]" /> Authentic Odia & Hindi speech synthesis
              </div>
            </div>

            {/* Pillar 6: Differentiator */}
            <div className="p-7 rounded-3xl border-2 border-[#FED7AA] bg-[#FFF7ED] hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center mb-5 font-bold">
                <Sparkles className="h-6 w-6 text-[#EA580C]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] mb-2 font-serif">Care Intelligence Score™</h3>
              <p className="text-[#57534E] text-sm leading-relaxed mb-4">
                Our algorithmic differentiator: a transparent composite index synthesizing medication adherence, open tasks, alert clearance, and freshness.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#9A3412]">
                <CheckCircle2 className="h-4 w-4 text-[#EA580C]" /> Grounded, non-hallucinatory evidence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAE3D8] py-12 text-center text-xs text-[#78716C] bg-[#FAF8F5]">
        <p className="font-bold text-[#292524] text-sm font-serif">ElderCare 360 · Smarter Seva. Safer Living.</p>
        <p className="mt-1">
          Designed for Indian Senior Care & DPDP Act Alignment · Dedicated to Elders Living with Dignity
        </p>
      </footer>
    </div>
  )
}
