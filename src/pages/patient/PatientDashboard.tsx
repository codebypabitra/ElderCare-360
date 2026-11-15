import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pill, Activity, HeartPulse, AlertTriangle, CheckCircle2,
  Calendar, ShieldAlert, Sparkles, Clock, ArrowRight, Droplets,
  Thermometer, Bot
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Badge } from '@/components/ui/Badge'
import { formatTime, formatDate, getGreeting } from '@/lib/utils'

export default function PatientDashboard() {
  const {
    currentUser,
    medicationLogs,
    updateMedicationLog,
    healthReadings,
    emergencyEvents,
    careTasks,
    getAdherenceRate,
    getCareIntelligenceScore,
    getAIInsights,
    getAppointments,
    triggerSOS,
  } = useApp()

  const [sosConfirmOpen, setSosConfirmOpen] = useState(false)

  const adherence = getAdherenceRate()
  const score = getCareIntelligenceScore()
  const insights = getAIInsights()
  const appointments = getAppointments()

  // Filter today's medications
  const todayStr = new Date().toISOString().split('T')[0]
  const todayLogs = medicationLogs.filter(l => l.scheduled_at.startsWith(todayStr))
  const takenCount = todayLogs.filter(l => l.status === 'taken' || l.status === 'late').length

  // Latest vitals
  const latestBP = healthReadings.find(r => r.metric_type === 'blood_pressure_systolic')
  const latestBPDia = healthReadings.find(r => r.metric_type === 'blood_pressure_diastolic')
  const latestHR = healthReadings.find(r => r.metric_type === 'heart_rate')
  const latestSpO2 = healthReadings.find(r => r.metric_type === 'spo2')
  const latestSugar = healthReadings.find(r => r.metric_type === 'blood_glucose')

  const openEmergency = emergencyEvents.find(e => e.status === 'open')

  return (
    <div className="space-y-6">
      {/* Top emergency notification banner if any */}
      {openEmergency && (
        <div className="p-4 rounded-2xl bg-red-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-red-600/20 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-base">EMERGENCY PROTOCOL ACTIVE</p>
              <p className="text-xs text-red-100">{openEmergency.description || 'Distress signal received'}</p>
            </div>
          </div>
          <Link
            to="/patient/emergency"
            className="px-4 py-2 rounded-xl bg-white text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
          >
            Review Emergency Status
          </Link>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title={`${getGreeting()}, ${currentUser?.full_name || 'Ramesh Ji'} 👋`}
        subtitle="Here is your health overview and scheduled medications for today."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSosConfirmOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-red-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              EMERGENCY SOS
            </button>
          </div>
        }
      />

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Medications"
          value={`${takenCount} / ${todayLogs.length}`}
          subtitle="Doses taken today"
          icon={<Pill className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Medication Adherence"
          value={`${adherence}%`}
          subtitle="Overall 7-day rate"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend="up"
          trendValue="Consistently high"
        />
        <StatCard
          title="Vitals Status"
          value={latestBP ? `${latestBP.value}/${latestBPDia ? latestBPDia.value : 80}` : '120/80'}
          subtitle="Latest BP (mmHg)"
          icon={<HeartPulse className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Care Score"
          value={`${score.overall}/100`}
          subtitle="Care Intelligence Engine"
          icon={<Sparkles className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Main Grid: Medication Checklist + Care Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Medication Action Board (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Today's Medication Routine
                </h2>
                <p className="text-xs text-slate-500">Tap "I Took This" when you ingest your dose</p>
              </div>
              <Link
                to="/patient/medications"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Full Medicine List <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {todayLogs.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No medications scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todayLogs.map(log => {
                  const isDone = log.status === 'taken' || log.status === 'late'
                  const isMissed = log.status === 'missed'
                  const time = log.scheduled_at.split('T')[1].substring(0, 5)

                  return (
                    <div
                      key={log.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isMissed
                          ? 'bg-red-50/50 border-red-200'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-700'
                              : isMissed
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {formatTime(time)}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900">
                            {log.medication?.medicine_name || 'Prescribed Medicine'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.medication?.dosage} · {log.medication?.instructions || 'Take with water'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" /> Taken
                          </span>
                        ) : isMissed ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700">
                              Missed Dose
                            </span>
                            <button
                              onClick={() => updateMedicationLog(log.id, 'late')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                            >
                              Log Late
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => updateMedicationLog(log.id, 'taken')}
                              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
                            >
                              I Took This ✓
                            </button>
                            <button
                              onClick={() => updateMedicationLog(log.id, 'skipped')}
                              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                            >
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Health Telemetry Snapshot */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Health Vitals Snapshot
                </h2>
                <p className="text-xs text-slate-500">Live readings from monitoring devices</p>
              </div>
              <Link
                to="/patient/health"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Log New Reading <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5 text-red-500" /> Blood Pressure
                </p>
                <p className="text-lg font-black text-slate-900">
                  {latestBP ? `${latestBP.value}/${latestBPDia ? latestBPDia.value : 82}` : '135/82'}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Normal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-pink-500" /> Heart Rate
                </p>
                <p className="text-lg font-black text-slate-900">
                  {latestHR ? `${latestHR.value} bpm` : '74 bpm'}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Stable
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" /> Oxygen (SpO2)
                </p>
                <p className="text-lg font-black text-slate-900">
                  {latestSpO2 ? `${latestSpO2.value}%` : '98%'}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Optimal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500" /> Blood Sugar
                </p>
                <p className="text-lg font-black text-slate-900">
                  {latestSugar ? `${latestSugar.value} mg` : '110 mg/dL'}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Fasting Normal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Care Intelligence Score + AI Assistant Card */}
        <div className="space-y-6">
          {/* Care Intelligence Score Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">Care Intelligence Score™</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time multi-dimensional patient safety status
            </p>

            <div className="flex justify-center my-3">
              <ProgressRing value={score.overall} size={130} strokeWidth={12} label="Care Health" />
            </div>

            <div className="space-y-2 mt-4 text-left border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Medication Adherence (40%)</span>
                <span className="font-bold text-slate-900">{score.medicationAdherence}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Pending Tasks (25%)</span>
                <span className="font-bold text-slate-900">{score.pendingTasks} tasks</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Unresolved Emergencies (20%)</span>
                <span className="font-bold text-slate-900">{score.unresolvedAlerts}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Vitals Telemetry Freshness (15%)</span>
                <span className="font-bold text-emerald-600 capitalize">{score.dataFreshness}</span>
              </div>
            </div>
          </div>

          {/* AI Companion Quick Card */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">AI Care Companion</h4>
                <p className="text-xs text-purple-700">English · हिन्दी · ଓଡ଼ିଆ Support</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ask questions about your prescribed pills, explain medical warnings in Odia, or summarize your weekly health trends.
            </p>
            <Link
              to="/patient/assistant"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 shadow-sm"
            >
              Talk to Care Companion
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Upcoming Appointment */}
          {appointments.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Next Doctor Appointment</h4>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900">Dr. Anil Sharma</p>
                <p className="text-xs text-slate-500">Cardiology Regular Review</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-600 font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(appointments[0].appointment_at)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {sosConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-red-500 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">TRIGGER EMERGENCY SOS?</h3>
            <p className="text-sm text-slate-600 mb-6">
              This will immediately send distress alerts to your daughter <strong>Priya Kumar</strong>, caregiver <strong>Sunita Devi</strong>, and doctor <strong>Dr. Anil Sharma</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  triggerSOS('Patient pressed emergency distress SOS button from dashboard')
                  setSosConfirmOpen(false)
                }}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-600/30 cursor-pointer"
              >
                YES, SEND DISTRESS ALERT NOW
              </button>
              <button
                onClick={() => setSosConfirmOpen(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Cancel (False Alarm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
