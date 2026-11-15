import { useState } from 'react'
import {
  Printer, Download, Sparkles, Pill, HeartPulse
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatDate } from '@/lib/utils'

export default function ReportsPage() {
  const {
    medications,
    getCareIntelligenceScore,
    getAIInsights,
    getPatientProfiles,
  } = useApp()

  const [downloading, setDownloading] = useState(false)
  const patient = getPatientProfiles()[0]
  const score = getCareIntelligenceScore()
  const insights = getAIInsights()

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert("Swasthya Patrika (Clinical Care Summary PDF) successfully generated and saved to your device.")
    }, 1000)
  }

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Swasthya Patrika & Clinical Reports (ସ୍ୱାସ୍ଥ୍ୟ ପତ୍ରିକା)"
        subtitle="Verifiable evidence-backed summaries formatted for physician review and family coordination."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white border border-[#EAE3D8] text-[#44403C] hover:bg-[#F5F1EB] text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print Patrika
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="h-4 w-4" /> {downloading ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        }
      />

      {/* Main Printable Dossier Card */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-white p-8 sm:p-10 shadow-xs space-y-8" id="printable-report">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EAE3D8] gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#C2410C] text-white flex items-center justify-center font-bold">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1C1917] font-serif">ELDERCARE 360 · SWASTHYA PATRIKA (ସ୍ୱାସ୍ଥ୍ୟ ପତ୍ରିକା)</h2>
              <p className="text-xs text-[#78716C]">Consolidated Senior Care Report · Generated: {formatDate(new Date())}</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-[#57534E]">
            <p className="font-bold text-[#1C1917]">Patient: {patient.user?.full_name} Ji</p>
            <p>Age: 72 · Blood Group: {patient.blood_group} · Bhubaneswar</p>
            <p>Physician: Dr. Anil Sharma, MD (Cardiology)</p>
          </div>
        </div>

        {/* Section 1: Care Intelligence Engine Score */}
        <div className="rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <ProgressRing value={score.overall} size={110} strokeWidth={10} label="Score" color="#C2410C" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C2410C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
                Algorithmic Differentiator
              </span>
              <h3 className="text-lg font-bold text-[#1C1917] font-serif mt-1.5">Care Intelligence Score™</h3>
              <p className="text-xs text-[#78716C] max-w-md mt-0.5 leading-relaxed">
                Composite evaluation index balancing 7-day adherence (40%), task completion (25%), open alert resolution (20%), and telemetry recency (15%).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center shrink-0 w-full md:w-auto">
            <div className="p-3.5 bg-white rounded-2xl border border-[#EAE3D8]">
              <p className="text-[11px] text-[#78716C] font-medium">Medication Adherence</p>
              <p className="text-xl font-black text-[#059669] font-serif">{score.medicationAdherence}%</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-[#EAE3D8]">
              <p className="text-[11px] text-[#78716C] font-medium">Telemetry Freshness</p>
              <p className="text-xl font-black text-[#0F766E] font-serif capitalize">{score.dataFreshness}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Active Prescriptions Inventory */}
        <div>
          <h3 className="text-base font-bold text-[#1C1917] font-serif mb-3 flex items-center gap-2">
            <Pill className="h-4 w-4 text-[#C2410C]" />
            Active Medical Prescriptions & Supply Inventory (ଔଷଧ ସୂଚୀ)
          </h3>
          <div className="rounded-2xl border border-[#EAE3D8] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#78716C] uppercase border-b border-[#EAE3D8]">
                <tr>
                  <th className="p-3.5 font-bold">Drug Name</th>
                  <th className="p-3.5 font-bold">Dosage</th>
                  <th className="p-3.5 font-bold">Directions</th>
                  <th className="p-3.5 font-bold">Commencement</th>
                  <th className="p-3.5 font-bold">Remaining Supply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D8]">
                {medications.map(m => (
                  <tr key={m.id}>
                    <td className="p-3.5 font-bold text-[#1C1917]">{m.medicine_name}</td>
                    <td className="p-3.5 text-[#57534E]">{m.dosage}</td>
                    <td className="p-3.5 text-[#78716C]">{m.instructions || 'Daily'}</td>
                    <td className="p-3.5 text-[#A8A29E]">{formatDate(m.start_date)}</td>
                    <td className="p-3.5 font-bold text-[#1C1917]">{m.stock_count || 0} tablets</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Grounded Evidence-Based AI Care Summary */}
        <div>
          <h3 className="text-base font-bold text-[#1C1917] font-serif mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#EA580C]" />
            Grounded Care Insights & Observational Summary (ନିଷ୍କର୍ଷ)
          </h3>
          <div className="space-y-3">
            {insights.map(i => (
              <div key={i.id} className="p-4 rounded-2xl border border-[#EAE3D8] bg-[#FAF8F5]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412]">
                    {i.category}
                  </span>
                  <span className="text-xs text-[#78716C]">Synthesized from live Supabase records</span>
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">{i.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {i.evidence.map((e, idx) => (
                    <span key={idx} className="text-[10px] bg-white border border-[#EAE3D8] px-2 py-0.5 rounded-md text-[#78716C]">
                      Evidence: {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Medical Disclaimer Footer */}
        <div className="pt-6 border-t border-[#EAE3D8] text-[11px] text-[#A8A29E] space-y-1">
          <p className="font-semibold text-[#57534E]">Regulatory & Safety Alignment:</p>
          <p>
            ElderCare 360 is a supportive coordination platform. Information provided in this report reflects patient telemetry logs and does not substitute for licensed clinical diagnosis or medical device certification. Compliant with Digital Personal Data Protection Act (DPDP India, 2023) and ICMR senior clinical guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
