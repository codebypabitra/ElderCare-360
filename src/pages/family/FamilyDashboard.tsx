import { Link } from 'react-router-dom'
import {
  Users, Pill, AlertTriangle,
  CheckCircle2, ArrowRight, Sparkles, Phone, FileText
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { formatDate } from '@/lib/utils'

export default function FamilyDashboard() {
  const {
    medicationLogs,
    emergencyEvents,
    careTasks,
    getAdherenceRate,
    getCareIntelligenceScore,
    getAIInsights,
  } = useApp()

  const adherence = getAdherenceRate()
  const score = getCareIntelligenceScore()
  const insights = getAIInsights()

  const missedLogs = medicationLogs.filter(l => l.status === 'missed')
  const openAlerts = emergencyEvents.filter(e => e.status === 'open')
  const pendingTasks = careTasks.filter(t => t.status === 'pending' || t.status === 'overdue')

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Parivaar Oversight Hub (ପରିବାର ସୁରକ୍ଷା)"
        subtitle="Monitoring care for Ramesh Kumar Ji (Father in Bhubaneswar) from Bengaluru. Live telemetry & escalations."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/reports"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#EAE3D8] text-[#44403C] hover:bg-[#F5F1EB] text-xs font-bold flex items-center gap-2 shadow-2xs"
            >
              <FileText className="h-4 w-4" />
              Download Swasthya Patrika
            </Link>
            <Link
              to="/family/patient/patient-001"
              className="px-4 py-2.5 rounded-2xl bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <Users className="h-4 w-4" />
              Pitaji ka Detailed Record
            </Link>
          </div>
        }
      />

      {/* Emergency Alert Banner if any open */}
      {openAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#DC2626] text-white flex items-center justify-between shadow-lg shadow-[#DC2626]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-sm">URGENT CARE ALERT FOR RAMESH JI</p>
              <p className="text-xs text-red-100">{openAlerts[0].description || 'Emergency incident requires acknowledgment'}</p>
            </div>
          </div>
          <Link
            to="/patient/emergency"
            className="px-4 py-2 rounded-xl bg-white text-[#DC2626] font-bold text-xs hover:bg-red-50"
          >
            Review & Coordinate
          </Link>
        </div>
      )}

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Care Intelligence</p>
            <p className="text-2xl font-black text-[#C2410C] mt-1 font-serif">{score.overall}/100</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Overall safety score</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Dawai Adherence</p>
            <p className="text-2xl font-black text-[#059669] mt-1 font-serif">{adherence}%</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">{missedLogs.length} missed in 7 days</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#D1FAE5] text-[#065F46] flex items-center justify-center">
            <Pill className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Attendant Seva</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">{pendingTasks.length} Pending</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Sunita Devi on duty</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FAF8F5] text-[#1C1917] border border-[#EAE3D8] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Aapatkaalin Status</p>
            <p className="text-2xl font-black text-[#059669] mt-1 font-serif">{openAlerts.length === 0 ? 'All Clear' : `${openAlerts.length} Active`}</p>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">Zero critical distress</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Grid: Patient Profile & Weekly Care Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Adherence Patterns & Missed Doses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Missed-Dose Escalation Feed */}
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <Pill className="h-5 w-5 text-[#C2410C]" />
                  Missed-Dose Escalation Telemetry (ଦବାଇ ଖସିଯିବା ସୂଚନା)
                </h3>
                <p className="text-xs text-[#78716C]">Notifications automatically dispatched upon grace period expiration</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                30-min grace limit
              </span>
            </div>

            {missedLogs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                Zero missed doses recorded this week! Ramesh Ji is taking all medications on time.
              </div>
            ) : (
              <div className="space-y-3">
                {missedLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-[#B91C1C] bg-[#FEE2E2] px-2.5 py-0.5 rounded-md">
                          Escalated Missed Dose
                        </span>
                        <span className="text-xs font-bold text-[#1C1917]">
                          {log.medication?.medicine_name} ({log.medication?.dosage})
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] mt-1">
                        Scheduled: {new Date(log.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {formatDate(log.scheduled_at)}. Patient did not acknowledge.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="tel:+919876543210"
                        className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call Pitaji (+91)
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tasks Assigned to Attendant */}
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                  Seva Tasks Supervised by Attendant (Sunita Devi)
                </h3>
                <p className="text-xs text-[#78716C]">Live accountability checklist</p>
              </div>
              <Link to="/caregiver/tasks" className="text-xs font-bold text-[#C2410C] hover:text-[#9A3412] flex items-center gap-1">
                View All Tasks <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {careTasks.map(t => (
                <div key={t.id} className="p-3.5 rounded-2xl border border-[#EAE3D8] bg-[#FAF8F5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      t.status === 'completed' ? 'bg-[#DCFCE7] text-[#15803D]' :
                      t.status === 'overdue' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                      'bg-[#F5F1EB] text-[#78716C]'
                    }`}>
                      {t.status === 'completed' ? '✓' : '!'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C1917]">{t.title}</p>
                      <p className="text-xs text-[#78716C]">{t.description}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    t.status === 'completed' ? 'bg-[#DCFCE7] text-[#15803D]' :
                    t.status === 'overdue' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                    'bg-[#FEF3C7] text-[#B45309]'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1 Col: Care Intelligence Engine Daily Summary */}
        <div className="space-y-6">
          {/* AI Evidence-Based Care Summary */}
          <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-[#EA580C]" />
              <h3 className="text-base font-bold text-[#1C1917] font-serif">Care Intelligence Summary</h3>
            </div>
            <p className="text-xs text-[#78716C] mb-4">
              Synthesized directly from live Supabase clinical logs
            </p>

            <div className="space-y-3">
              {insights.map(i => (
                <div key={i.id} className="p-4 rounded-2xl bg-white border border-[#FED7AA] shadow-2xs">
                  <p className="text-xs font-bold text-[#9A3412] capitalize mb-1">{i.category.replace('_', ' ')}</p>
                  <p className="text-xs text-[#57534E] leading-relaxed mb-2">{i.summary}</p>
                  <div className="space-y-1">
                    {i.evidence.map((ev, idx) => (
                      <span key={idx} className="inline-block text-[10px] bg-[#FFF7ED] text-[#C2410C] px-2 py-0.5 rounded mr-1 font-semibold">
                        • {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Father */}
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center mx-auto font-black text-lg border border-[#FED7AA]">
              RK
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1C1917] font-serif">Ramesh Kumar Ji (Father)</h4>
              <p className="text-xs text-[#78716C]">+91 98765 43210 · Bhubaneswar</p>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href="tel:+919876543210"
                className="flex-1 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> Call Pitaji
              </a>
              <Link
                to="/patient/assistant"
                className="flex-1 py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F1EB] text-[#292524] border border-[#EAE3D8] font-bold text-xs flex items-center justify-center transition-colors"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
