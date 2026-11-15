import { Link } from 'react-router-dom'
import {
  Stethoscope, Users, Pill, Activity, AlertTriangle,
  ClipboardList, CheckCircle2, ArrowRight, Sparkles, FileText, Calendar
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function DoctorDashboard() {
  const {
    currentUser,
    medications,
    healthReadings,
    emergencyEvents,
    getAdherenceRate,
    getAppointments,
    getPatientProfiles,
  } = useApp()

  const adherence = getAdherenceRate()
  const appointments = getAppointments()
  const patients = getPatientProfiles()

  // Clinical alerts
  const abnormalReadings = healthReadings.filter(
    r => (r.metric_type === 'blood_pressure_systolic' && (r.value > 140 || r.value < 90)) ||
         (r.metric_type === 'spo2' && r.value < 95)
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Clinical Oversight — Dr. Anil Sharma, MD`}
        subtitle="Consulting Cardiologist · Reviewing elderly patient adherence patterns and physiological telemetry."
        action={
          <Link
            to="/doctor/prescriptions"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            AI Prescription Scanner Tool
          </Link>
        }
      />

      {/* 4 Clinical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Patient Under Care"
          value={patients.length}
          subtitle="Ramesh Kumar (72)"
          icon={<Users className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Patient Adherence"
          value={`${adherence}%`}
          subtitle="7-day verified compliance"
          icon={<Pill className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Flagged Vital Events"
          value={abnormalReadings.length}
          subtitle="Systolic or SpO2 excursions"
          icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
          iconBg="bg-red-50"
        />
        <StatCard
          title="Upcoming Consults"
          value={appointments.length}
          subtitle="Follow-up scheduled"
          icon={<Calendar className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Grid: Active Clinical Cases & Prescription Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Clinical Telemetry Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Physiological Risk Stratification
                </h3>
                <p className="text-xs text-slate-500">Live readings against cardiology protocols</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Low Cardiovascular Risk
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Blood Pressure Consistency</span>
                <span className="text-xs font-semibold text-emerald-600">Stable (Mean 128/82 mmHg)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">Amlodipine 5mg Adherence</span>
                <span className="text-xs font-semibold text-blue-600">92% Compliance</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[92%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">SpO2 Oxygen Saturation</span>
                <span className="text-xs font-semibold text-emerald-600">Optimal (98%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%] rounded-full"></div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to="/family/patient/patient-001"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Inspect Complete Chart <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Prescription Action */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/60 to-indigo-50/40 p-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                AI Vision Feature
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Prescription OCR Digitizer</h4>
              <p className="text-xs text-slate-600 max-w-md mt-0.5">
                Scan or upload handwritten physician scripts. The AI extracts medicines, dosages, and schedules with clinician confirmation.
              </p>
            </div>
            <Link
              to="/doctor/prescriptions"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 shrink-0"
            >
              Open OCR Scanner
            </Link>
          </div>
        </div>

        {/* 1 Col: Appointment & Clinic Notes */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Upcoming Patient Consultation
            </h4>
            {appointments.length > 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-xs text-slate-400">Scheduled Time</p>
                <p className="text-sm font-black text-slate-900">
                  {new Date(appointments[0].appointment_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                  Patient: Ramesh Kumar (Age 72)
                </p>
                <p className="text-xs text-slate-500">
                  Objective: Quarterly hypertension review & fasting glucose evaluation.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No pending consultations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
