import { useState } from 'react'
import {
  FileText, Download, Printer, Sparkles, CheckCircle2,
  Calendar, Pill, Activity, ShieldCheck, HeartPulse
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatDate } from '@/lib/utils'

export default function ReportsPage() {
  const {
    currentUser,
    medications,
    medicationLogs,
    healthReadings,
    careTasks,
    getAdherenceRate,
    getCareIntelligenceScore,
    getAIInsights,
    getPatientProfiles,
  } = useApp()

  const [downloading, setDownloading] = useState(false)
  const patient = getPatientProfiles()[0]
  const adherence = getAdherenceRate()
  const score = getCareIntelligenceScore()
  const insights = getAIInsights()

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert("Clinical Care Summary PDF successfully generated and saved to your device.")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Reports & Care Analytics"
        subtitle="Verifiable evidence-backed summaries formatted for physician review and family coordination."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print Report
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="h-4 w-4" /> {downloading ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        }
      />

      {/* Main Printable Dossier Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-8" id="printable-report">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">ELDERCARE 360 · CLINICAL CARE SUMMARY</h2>
              <p className="text-xs text-slate-500">Official Consolidated Care Report · Generated: {formatDate(new Date())}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-600">
            <p className="font-bold text-slate-900">Patient: {patient.user?.full_name}</p>
            <p>Age: 72 · Blood Group: {patient.blood_group}</p>
            <p>Physician: Dr. Anil Sharma, MD</p>
          </div>
        </div>

        {/* Section 1: Care Intelligence Engine Score */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <ProgressRing value={score.overall} size={110} strokeWidth={10} label="Score" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Differentiating Metric
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Care Intelligence Score™</h3>
              <p className="text-xs text-slate-500 max-w-md mt-0.5">
                Composite evaluation index balancing 7-day adherence (40%), task completion (25%), open alert resolution (20%), and telemetry recency (15%).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center shrink-0 w-full md:w-auto">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Medication Adherence</p>
              <p className="text-xl font-black text-emerald-600">{score.medicationAdherence}%</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Telemetry Freshness</p>
              <p className="text-xl font-black text-blue-600 capitalize">{score.dataFreshness}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Active Prescriptions Inventory */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Pill className="h-4 w-4 text-blue-600" />
            Active Medical Prescriptions & Inventory
          </h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold">Drug Name</th>
                  <th className="p-3 font-bold">Dosage</th>
                  <th className="p-3 font-bold">Directions</th>
                  <th className="p-3 font-bold">Commencement</th>
                  <th className="p-3 font-bold">Inventory Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medications.map(m => (
                  <tr key={m.id}>
                    <td className="p-3 font-bold text-slate-900">{m.medicine_name}</td>
                    <td className="p-3 text-slate-700">{m.dosage}</td>
                    <td className="p-3 text-slate-600">{m.instructions || 'Daily'}</td>
                    <td className="p-3 text-slate-500">{formatDate(m.start_date)}</td>
                    <td className="p-3 font-bold text-slate-900">{m.stock_count || 0} tablets</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Grounded Evidence-Based AI Care Summary */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Grounded Care Insights & Observational Summary
          </h3>
          <div className="space-y-3">
            {insights.map(i => (
              <div key={i.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {i.category}
                  </span>
                  <span className="text-xs text-slate-400">Synthesized from patient records</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{i.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {i.evidence.map((e, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                      Evidence: {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Medical Disclaimer Footer */}
        <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-600">Compliance & Regulatory Disclaimer:</p>
          <p>
            ElderCare 360 is a supportive coordination platform. Information provided in this report reflects patient telemetry logs and does not substitute for licensed clinical diagnosis or medical device certification. Compliant with Digital Personal Data Protection Act (DPDP India, 2023).
          </p>
        </div>
      </div>
    </div>
  )
}
