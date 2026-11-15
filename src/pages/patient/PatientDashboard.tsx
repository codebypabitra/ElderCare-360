import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Pill, Activity, HeartPulse, AlertTriangle, CheckCircle2,
  Calendar, ShieldAlert, Sparkles, Clock, ArrowRight, Droplets,
  Thermometer, Bot, Heart, Coffee, Sun, Moon
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatTime, formatDate, getGreeting } from '@/lib/utils'

export default function PatientDashboard() {
  const {
    currentUser,
    medicationLogs,
    updateMedicationLog,
    healthReadings,
    emergencyEvents,
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

  // Helper for Indian meal times
  const getMealTimeHint = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0], 10)
    if (hour < 11) return { label: 'Subah Naashte ke Baad (Breakfast)', icon: Coffee }
    if (hour < 16) return { label: 'Dophar Bhojan ke Baad (Lunch)', icon: Sun }
    return { label: 'Raatri Bhojan ke Baad (Dinner)', icon: Moon }
  }

  return (
    <div className="space-y-6 text-[#1C1917]">
      {/* Top emergency notification banner if any */}
      {openEmergency && (
        <div className="p-4 rounded-2xl bg-[#DC2626] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-[#DC2626]/20 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-base">AAPATKAALIN ALERT: EMERGENCY NOTIFIED</p>
              <p className="text-xs text-red-100">{openEmergency.description || 'Priya and caregiver have been notified.'}</p>
            </div>
          </div>
          <Link
            to="/patient/emergency"
            className="px-4 py-2 rounded-xl bg-white text-[#DC2626] text-xs font-bold hover:bg-red-50 transition-colors"
          >
            Review Emergency Status
          </Link>
        </div>
      )}

      {/* Header with Warm Indian Honorific */}
      <PageHeader
        title={`Namaste Ramesh Ji! (ନମସ୍କାର) 🙏`}
        subtitle="Here is your health overview, prescription schedule, and family care status."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSosConfirmOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-[#DC2626]/30 transition-all hover:scale-105 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              EMERGENCY SOS (सहायता)
            </button>
          </div>
        }
      />

      {/* 4 Claude Style Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Aaj ki Dawai</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">{takenCount} / {todayLogs.length}</p>
            <p className="text-[11px] text-[#A8A29E] mt-0.5">Doses taken today</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center">
            <Pill className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Niyamit Adherence</p>
            <p className="text-2xl font-black text-[#059669] mt-1 font-serif">{adherence}%</p>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">High consistency</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#D1FAE5] text-[#065F46] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Raktachaap (BP)</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">
              {latestBP ? `${latestBP.value}/${latestBPDia ? latestBPDia.value : 82}` : '124/82'}
            </p>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">Normal (ICMR Range)</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center">
            <HeartPulse className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Care Intelligence</p>
            <p className="text-2xl font-black text-[#C2410C] mt-1 font-serif">{score.overall}/100</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Seva health rating</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Dawai Schedule + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Medication Action Board (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <Pill className="h-5 w-5 text-[#C2410C]" />
                  Today's Dawai Schedule (ଦୈନିକ ଔଷଧ ନିୟମ)
                </h2>
                <p className="text-xs text-[#78716C] mt-0.5">Tap the large button when you take your medicines</p>
              </div>
              <Link
                to="/patient/medications"
                className="text-xs font-bold text-[#C2410C] hover:text-[#9A3412] flex items-center gap-1"
              >
                All Prescriptions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {todayLogs.length === 0 ? (
              <p className="text-sm text-[#78716C] py-8 text-center">No medications scheduled for today.</p>
            ) : (
              <div className="space-y-3.5">
                {todayLogs.map(log => {
                  const isDone = log.status === 'taken' || log.status === 'late'
                  const isMissed = log.status === 'missed'
                  const time = log.scheduled_at.split('T')[1].substring(0, 5)
                  const mealHint = getMealTimeHint(time)
                  const MealIcon = mealHint.icon

                  return (
                    <div
                      key={log.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                          : isMissed
                          ? 'bg-[#FEF2F2] border-[#FECACA]'
                          : 'bg-[#FAF8F5] border-[#EAE3D8] hover:border-[#FED7AA]'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div
                          className={`h-12 w-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 ${
                            isDone
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : isMissed
                              ? 'bg-[#FEE2E2] text-[#B91C1C]'
                              : 'bg-[#FFEDD5] text-[#9A3412]'
                          }`}
                        >
                          <Clock className="h-4 w-4 mb-0.5" />
                          <span>{formatTime(time).split(' ')[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-bold text-[#1C1917]">
                              {log.medication?.medicine_name || 'Prescribed Pill'}
                            </p>
                            <span className="text-xs font-bold text-[#C2410C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                              {log.medication?.dosage}
                            </span>
                          </div>
                          <p className="text-xs text-[#57534E] mt-0.5 flex items-center gap-1.5 font-medium">
                            <MealIcon className="h-3.5 w-3.5 text-[#C2410C]" />
                            {log.medication?.instructions || mealHint.label}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                            <CheckCircle2 className="h-4 w-4" /> Dawai Li (Taken) ✓
                          </span>
                        ) : isMissed ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FEE2E2] text-[#B91C1C]">
                              Chhoot Gayi (Missed)
                            </span>
                            <button
                              onClick={() => updateMedicationLog(log.id, 'late')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#1C1917] text-white hover:bg-[#292524] cursor-pointer"
                            >
                              Log Late
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => updateMedicationLog(log.id, 'taken')}
                              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-black shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Dawai Li (I Took This) ✓
                            </button>
                            <button
                              onClick={() => updateMedicationLog(log.id, 'skipped')}
                              className="px-3.5 py-3 rounded-2xl bg-white border border-[#EAE3D8] hover:bg-[#F5F1EB] text-[#78716C] text-xs font-semibold cursor-pointer"
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

          {/* Swasthya Vitals Snapshot */}
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#0F766E]" />
                  Swasthya Vitals (ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥିତି)
                </h2>
                <p className="text-xs text-[#78716C]">Continuous physiological telemetry</p>
              </div>
              <Link
                to="/patient/health"
                className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1"
              >
                Log Reading <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
                <p className="text-xs font-bold text-[#78716C] mb-1 flex items-center justify-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5 text-[#DC2626]" /> Raktachaap (BP)
                </p>
                <p className="text-xl font-black text-[#1C1917] font-serif">
                  {latestBP ? `${latestBP.value}/${latestBPDia ? latestBPDia.value : 82}` : '124/82'}
                </p>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block mt-1">
                  ICMR Normal
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
                <p className="text-xs font-bold text-[#78716C] mb-1 flex items-center justify-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-[#C2410C]" /> Hridaya Gati (Pulse)
                </p>
                <p className="text-xl font-black text-[#1C1917] font-serif">
                  {latestHR ? `${latestHR.value} bpm` : '74 bpm'}
                </p>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block mt-1">
                  Stable
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
                <p className="text-xs font-bold text-[#78716C] mb-1 flex items-center justify-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-[#0F766E]" /> Oxygen (SpO2)
                </p>
                <p className="text-xl font-black text-[#1C1917] font-serif">
                  {latestSpO2 ? `${latestSpO2.value}%` : '98%'}
                </p>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block mt-1">
                  Optimal
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
                <p className="text-xs font-bold text-[#78716C] mb-1 flex items-center justify-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-[#D97706]" /> Rakt Sarkara (Sugar)
                </p>
                <p className="text-xl font-black text-[#1C1917] font-serif">
                  {latestSugar ? `${latestSugar.value}` : '110'} <span className="text-xs font-normal">mg/dL</span>
                </p>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full inline-block mt-1">
                  Fasting Normal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Care Intelligence Score + AI Assistant Card */}
        <div className="space-y-6">
          {/* Care Intelligence Score Card */}
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#EA580C]" />
              <h3 className="text-lg font-bold text-[#1C1917] font-serif">Care Intelligence Score™</h3>
            </div>
            <p className="text-xs text-[#78716C] mb-4">
              Real-time multi-dimensional patient safety status
            </p>

            <div className="flex justify-center my-3">
              <ProgressRing value={score.overall} size={135} strokeWidth={12} label="Care Health" color="#C2410C" />
            </div>

            <div className="space-y-2.5 mt-5 text-left border-t border-[#EAE3D8] pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Medication Routine (40%)</span>
                <span className="font-bold text-[#1C1917]">{score.medicationAdherence}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Caregiver Tasks (25%)</span>
                <span className="font-bold text-[#1C1917]">{score.pendingTasks} pending</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Emergency Alert Clearance (20%)</span>
                <span className="font-bold text-[#059669]">
                  {score.unresolvedAlerts === 0 ? 'All Clear' : `${score.unresolvedAlerts} Alert`}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Telemetry Freshness (15%)</span>
                <span className="font-bold text-[#059669] capitalize">{score.dataFreshness}</span>
              </div>
            </div>
          </div>

          {/* Regional AI Companion Quick Card */}
          <div className="rounded-3xl border border-[#CCFBF1] bg-[#F0FDFA] p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1917] font-serif">Aapka AI Sahayak</h4>
                <p className="text-xs text-[#115E59] font-medium">English · हिन्दी · ଓଡ଼ିଆ ସହାୟତା</p>
              </div>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed mb-4">
              Ask your companion about medicine timings in Odia, dosage cautions, or doctor visit preparations.
            </p>
            <Link
              to="/patient/assistant"
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-[#0F766E] hover:bg-[#115E59] text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              Sahayak se Baat Karein (Talk)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Upcoming Appointment */}
          {appointments.length > 0 && (
            <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#C2410C]" />
                <h4 className="text-sm font-bold text-[#1C1917] font-serif">Agla Doctor Appointment</h4>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8]">
                <p className="text-sm font-bold text-[#1C1917]">Dr. Anil Sharma</p>
                <p className="text-xs text-[#78716C]">Cardiology Regular Review</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#C2410C] font-bold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#DC2626] text-center">
            <div className="h-16 w-16 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-[#1C1917] mb-2 font-serif">AAPATKAALIN SOS TRIGGER?</h3>
            <p className="text-sm text-[#57534E] mb-6">
              This will immediately send distress alerts to your daughter <strong>Priya Kumar</strong> in Bengaluru, attendant <strong>Sunita Devi</strong>, and doctor <strong>Dr. Anil Sharma</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  triggerSOS('Patient Ramesh Ji pressed emergency distress SOS button from dashboard')
                  setSosConfirmOpen(false)
                }}
                className="w-full py-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-base shadow-lg cursor-pointer"
              >
                HAAN, TURANT SAHAYATA BHEJEIN (SEND SOS)
              </button>
              <button
                onClick={() => setSosConfirmOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#F5F1EB] hover:bg-[#EAE3D8] text-[#44403C] font-bold text-sm cursor-pointer"
              >
                Galti se Daba (Cancel False Alarm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
