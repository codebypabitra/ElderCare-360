import { Link } from 'react-router-dom'
import {
  Users, Pill, Activity, AlertTriangle, ShieldCheck,
  CheckCircle2, Clock, ArrowRight, HeartPulse, Sparkles, Phone, FileText
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatDate } from '@/lib/utils'

export default function FamilyDashboard() {
  const {
    currentUser,
    medications,
    medicationLogs,
    healthReadings,
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
    <div className="space-y-6">
      <PageHeader
        title="Family Coordination Hub"
        subtitle={`Monitoring care for Ramesh Kumar (Father) from afar. Real-time telemetry & alerts.`}
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/reports"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <FileText className="h-4 w-4" />
              Download Weekly Audit
            </Link>
            <Link
              to="/family/patient/patient-001"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <Users className="h-4 w-4" />
              Detailed Patient Record
            </Link>
          </div>
        }
      />

      {/* Emergency Alert Banner if any open */}
      {openAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-600 text-white flex items-center justify-between shadow-lg shadow-red-600/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-sm">URGENT CARE ALERT FOR MR. RAMESH</p>
              <p className="text-xs text-red-100">{openAlerts[0].description || 'Emergency incident requires acknowledgment'}</p>
            </div>
          </div>
          <Link
            to="/patient/emergency"
            className="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs hover:bg-red-50"
          >
            Review & Coordinate
          </Link>
        </div>
      )}

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Care Intelligence Score"
          value={`${score.overall}/100`}
          subtitle="Composite safety rating"
          icon={<Sparkles className="h-6 w-6 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Medication Adherence"
          value={`${adherence}%`}
          subtitle={`${missedLogs.length} missed in 7 days`}
          icon={<Pill className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Caregiver Tasks"
          value={`${pendingTasks.length} Pending`}
          subtitle="Sunita Devi assigned"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Active Emergencies"
          value={openAlerts.length}
          subtitle={openAlerts.length === 0 ? 'All clear' : 'Action needed'}
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Grid: Patient Profile & Weekly Care Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Adherence Patterns & Missed Doses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Missed-Dose Escalation Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-indigo-600" />
                  Missed-Dose Escalation Telemetry
                </h3>
                <p className="text-xs text-slate-500">Notifications automatically dispatched upon grace period expiration</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Rule: 30 min grace limit
              </span>
            </div>

            {missedLogs.length === 0 ? (
              <div className="p-6 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Zero missed doses recorded this week! Adherence routine is optimal.
              </div>
            ) : (
              <div className="space-y-3">
                {missedLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                          Escalated Missed Dose
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {log.medication?.medicine_name} ({log.medication?.dosage})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Scheduled for: {new Date(log.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {formatDate(log.scheduled_at)}. Patient did not acknowledge.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="tel:+919876543210"
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call Father
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tasks Assigned to Caregiver */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Care Tasks Supervised by Attendant (Sunita Devi)
                </h3>
                <p className="text-xs text-slate-500">Live accountability checklist</p>
              </div>
              <Link to="/caregiver/tasks" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All Tasks <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {careTasks.map(t => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {t.status === 'completed' ? '✓' : '!'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.description}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
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
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Care Intelligence Summary</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Synthesized from actual database logs (not hallucinatory output)
            </p>

            <div className="space-y-3">
              {insights.map(i => (
                <div key={i.id} className="p-3.5 rounded-xl bg-white border border-indigo-100/80 shadow-2xs">
                  <p className="text-xs font-bold text-indigo-900 capitalize mb-1">{i.category.replace('_', ' ')}</p>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">{i.summary}</p>
                  <div className="space-y-1">
                    {i.evidence.map((ev, idx) => (
                      <span key={idx} className="inline-block text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded mr-1">
                        • {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Father */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto font-bold text-lg">
              RK
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Ramesh Kumar (Father)</h4>
              <p className="text-xs text-slate-500">+91 98765 43210 · Bhubaneswar</p>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href="tel:+919876543210"
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" /> Direct Call
              </a>
              <Link
                to="/patient/assistant"
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center"
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
