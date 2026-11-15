import { Link } from 'react-router-dom'
import {
  Users, Pill, Activity, AlertTriangle,
  ArrowRight, Sparkles, Calendar
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function DoctorDashboard() {
  const {
    healthReadings,
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
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title={`Clinical Oversight — Dr. Anil Sharma, MD`}
        subtitle="Consulting Cardiologist · Reviewing elderly patient adherence patterns and physiological telemetry (ଚିକିତ୍ସକ ସମୀକ୍ଷା)."
        action={
          <Link
            to="/doctor/prescriptions"
            className="px-5 py-2.5 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            AI Prescription Scanner Tool
          </Link>
        }
      />

      {/* 4 Clinical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Elderly Patient</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">Ramesh Ji (72)</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Bhubaneswar OPD</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#CCFBF1] text-[#115E59] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Patient Adherence</p>
            <p className="text-2xl font-black text-[#059669] mt-1 font-serif">{adherence}%</p>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">7-day verified compliance</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#D1FAE5] text-[#065F46] flex items-center justify-center">
            <Pill className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Flagged Vital Events</p>
            <p className="text-2xl font-black text-[#DC2626] mt-1 font-serif">{abnormalReadings.length}</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Systolic excursions</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Upcoming Consults</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">{appointments.length}</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Follow-up scheduled</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Grid: Active Clinical Cases & Prescription Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Clinical Telemetry Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#0F766E]" />
                  Cardiovascular Telemetry & Risk Stratification
                </h3>
                <p className="text-xs text-[#78716C]">Live readings against cardiology protocols</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                Low Cardiovascular Risk
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917]">Blood Pressure Stability</span>
                <span className="text-xs font-semibold text-[#059669]">Stable (Mean 126/82 mmHg)</span>
              </div>
              <div className="w-full bg-[#EAE3D8] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#059669] h-full w-[88%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#1C1917]">Amlodipine 5mg Adherence</span>
                <span className="text-xs font-semibold text-[#C2410C]">94% Compliance</span>
              </div>
              <div className="w-full bg-[#EAE3D8] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#C2410C] h-full w-[94%] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#1C1917]">SpO2 Oxygen Saturation</span>
                <span className="text-xs font-semibold text-[#0F766E]">Optimal (98%)</span>
              </div>
              <div className="w-full bg-[#EAE3D8] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0F766E] h-full w-[98%] rounded-full"></div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to="/family/patient/patient-001"
                className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1"
              >
                Inspect Complete Chart <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Prescription Action */}
          <div className="rounded-3xl border border-[#CCFBF1] bg-[#F0FDFA] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#115E59] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full border border-[#99F6E4]">
                AI Vision Feature
              </span>
              <h4 className="text-lg font-bold text-[#1C1917] font-serif mt-1.5">Prescription OCR Digitizer</h4>
              <p className="text-xs text-[#57534E] max-w-md mt-0.5 leading-relaxed">
                Scan or upload handwritten physician scripts. The AI extracts medicines, dosages, and schedules with clinician confirmation.
              </p>
            </div>
            <Link
              to="/doctor/prescriptions"
              className="px-5 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-xs shrink-0 cursor-pointer"
            >
              Open OCR Scanner
            </Link>
          </div>
        </div>

        {/* 1 Col: Appointment & Clinic Notes */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs">
            <h4 className="text-base font-bold text-[#1C1917] font-serif mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C2410C]" />
              Agla Patient Consultation
            </h4>
            {appointments.length > 0 ? (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] space-y-2">
                <p className="text-xs text-[#78716C]">Scheduled Time</p>
                <p className="text-sm font-black text-[#1C1917] font-serif">
                  {new Date(appointments[0].appointment_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-xs text-[#57534E] pt-1 border-t border-[#EAE3D8]">
                  Patient: Ramesh Kumar Ji (Age 72)
                </p>
                <p className="text-xs text-[#78716C]">
                  Objective: Quarterly hypertension review & fasting glucose evaluation.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#78716C]">No pending consultations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
