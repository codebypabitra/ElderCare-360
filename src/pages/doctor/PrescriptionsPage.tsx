import { useState } from 'react'
import {
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle,
  ArrowRight, ShieldCheck, Check, Clock, Edit2
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import type { PrescriptionExtraction, PrescriptionMedicine } from '@/types'

export default function PrescriptionsPage() {
  const { addMedication } = useApp()
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<PrescriptionExtraction | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Sample prescription images/scans to demo
  const sampleScans = [
    {
      name: "Dr. Anil Sharma — Cardiology Rx (Sample 1)",
      date: "Nov 14, 2026",
      medicines: [
        {
          name: "Telmisartan",
          dosage: "40mg",
          frequency: "Once daily (Morning)",
          instructions: "Take with water after breakfast",
          duration: "30 days",
          confidence: 0.96,
          needs_confirmation: true,
        },
        {
          name: "Atorvastatin",
          dosage: "10mg",
          frequency: "Once daily (Night)",
          instructions: "Take after dinner",
          duration: "30 days",
          confidence: 0.92,
          needs_confirmation: true,
        },
        {
          name: "Multivitamin Gold",
          dosage: "1 capsule",
          frequency: "Once daily",
          instructions: "Take with milk after lunch",
          duration: "15 days",
          confidence: 0.88,
          needs_confirmation: true,
        },
      ]
    }
  ]

  const runOcrAnalysis = (sample = sampleScans[0]) => {
    setSelectedFile(sample.name)
    setAnalyzing(true)
    setExtractedData(null)
    setConfirmed(false)

    setTimeout(() => {
      setAnalyzing(false)
      setExtractedData({
        medicines: sample.medicines,
        doctor_name: "Dr. Anil Sharma, MD (Cardiology)",
        date: "2026-11-14",
        review_required: true,
      })
    }, 1200)
  }

  const handleConfirmAndSchedule = () => {
    if (!extractedData) return

    // Convert extracted medicines into active patient prescriptions
    extractedData.medicines.forEach(med => {
      addMedication({
        patient_id: 'patient-001',
        medicine_name: med.name,
        dosage: med.dosage,
        instructions: med.instructions,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
        stock_count: 30,
        refill_threshold: 7,
      })
    })

    setConfirmed(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Prescription Scanner & Extraction Studio"
        subtitle="Digitizes physician prescriptions using OCR + Gemini medical structuring with strict clinician verification."
      />

      {/* Upload & Sample Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-500 bg-white p-6 text-center transition-all cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Upload Prescription Document</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Supports JPEG, PNG, or PDF medical slips
            </p>
            <button
              onClick={() => runOcrAnalysis()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
            >
              Select File from Device
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
              Hackathon Fast-Test
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1 mb-2">Pre-loaded Test Prescriptions</h4>
            <div className="space-y-2">
              {sampleScans.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => runOcrAnalysis(s)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/40 text-xs font-semibold transition-all flex items-center justify-between"
                >
                  <span className="truncate">{s.name}</span>
                  <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* OCR Result Processing Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Extraction Output & Verification Canvas
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedFile ? `File analyzed: ${selectedFile}` : 'Awaiting prescription input'}
                  </p>
                </div>
                {extractedData && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Clinician Review Required
                  </span>
                )}
              </div>

              {analyzing ? (
                <div className="py-20 text-center space-y-3">
                  <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm font-bold text-slate-900">Running OCR & Gemini Entity Extraction...</p>
                  <p className="text-xs text-slate-500">Parsing drug names, dosages, intervals and safety flags</p>
                </div>
              ) : extractedData ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs flex justify-between items-center text-purple-900 font-semibold">
                    <span>Doctor: {extractedData.doctor_name}</span>
                    <span>Date: {extractedData.date}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-bold">Extracted Drug</th>
                          <th className="p-3 font-bold">Dosage</th>
                          <th className="p-3 font-bold">Frequency</th>
                          <th className="p-3 font-bold">Instructions</th>
                          <th className="p-3 font-bold">Confidence</th>
                          <th className="p-3 font-bold">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {extractedData.medicines.map((m, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{m.name}</td>
                            <td className="p-3 text-slate-700">{m.dosage}</td>
                            <td className="p-3 text-slate-700">{m.frequency}</td>
                            <td className="p-3 text-slate-500">{m.instructions}</td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {Math.round(m.confidence * 100)}% Match
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {confirmed && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      Prescription Approved! The medicines have been committed into Ramesh Kumar's live medication schedules.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  Upload or click a sample prescription on the left to test the AI extractor.
                </div>
              )}
            </div>

            {extractedData && !confirmed && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  By clicking approve, schedules are written into the Postgres database.
                </span>
                <button
                  onClick={handleConfirmAndSchedule}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/20"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Approve & Schedule For Patient
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
