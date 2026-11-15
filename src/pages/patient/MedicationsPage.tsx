import { useState } from 'react'
import {
  Pill, Plus, AlertTriangle, CheckCircle2, Clock, Trash2,
  Calendar, RotateCcw, Filter, AlertCircle, Sparkles
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatTime, formatDate } from '@/lib/utils'
import type { DoseStatus } from '@/types'

export default function MedicationsPage() {
  const {
    medications,
    schedules,
    medicationLogs,
    addMedication,
    deleteMedication,
    updateMedicationLog,
    getAdherenceRate
  } = useApp()

  const [activeTab, setActiveTab] = useState<'active' | 'all' | 'logs'>('active')
  const [modalOpen, setModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [instructions, setInstructions] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [stockCount, setStockCount] = useState('30')
  const [refillThreshold, setRefillThreshold] = useState('7')

  const adherence = getAdherenceRate()

  const filteredMeds = activeTab === 'all'
    ? medications
    : medications.filter(m => m.status === 'active')

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !dosage) return

    addMedication({
      patient_id: 'patient-001',
      medicine_name: name,
      dosage,
      instructions: instructions || 'Take with water after meals',
      start_date: startDate,
      end_date: endDate || undefined,
      status: 'active',
      stock_count: parseInt(stockCount) || 30,
      refill_threshold: parseInt(refillThreshold) || 7,
    })

    // Reset & close
    setName('')
    setDosage('')
    setInstructions('')
    setStockCount('30')
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Intelligence"
        subtitle="Schedules, stock alerts, missed-dose escalation and verification."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Medication
          </button>
        }
      />

      {/* Adherence & Stock Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <ProgressRing value={adherence} size={110} strokeWidth={10} label="Adherence" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              Smart Adherence Telemetry
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {adherence >= 85 ? 'Excellent Routine Consistency' : 'Care Circle Intervention Recommended'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Calculated using: [Recorded as taken / Total doses due] × 100.
              Late doses are highlighted separately to ensure caregiver accuracy.
            </p>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Stock & Refill Telemetry
            </div>
            <div className="space-y-2 mt-3">
              {medications.filter(m => (m.stock_count || 0) <= (m.refill_threshold || 7)).map(m => (
                <div key={m.id} className="text-xs flex justify-between items-center text-amber-900 font-medium bg-amber-100/60 px-3 py-1.5 rounded-lg">
                  <span>{m.medicine_name}</span>
                  <span className="font-bold text-red-600">{m.stock_count} pills left (Refill Soon)</span>
                </div>
              ))}
              {medications.filter(m => (m.stock_count || 0) <= (m.refill_threshold || 7)).length === 0 && (
                <p className="text-xs text-emerald-700 font-medium">All medicines have sufficient supply.</p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-4">Automatic alerts sent to caregiver when stock drops under 7 doses.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Prescriptions ({medications.filter(m => m.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All History ({medications.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dose Occurrence Logs ({medicationLogs.length})
        </button>
      </div>

      {/* Content depending on active tab */}
      {activeTab !== 'logs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeds.map(med => {
            const medSchedules = schedules.filter(s => s.medication_id === med.id)
            const isLowStock = (med.stock_count || 0) <= (med.refill_threshold || 7)

            return (
              <div
                key={med.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{med.medicine_name}</h4>
                        <span className="text-xs font-semibold text-blue-600">{med.dosage}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      med.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                    {med.instructions || 'Take as advised'}
                  </p>

                  {/* Scheduled times */}
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Times</p>
                    <div className="flex flex-wrap gap-1.5">
                      {medSchedules.map(s => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                          <Clock className="h-3 w-3" />
                          {formatTime(s.scheduled_time)} ({s.frequency})
                        </span>
                      ))}
                      {medSchedules.length === 0 && (
                        <span className="text-xs text-slate-400">Daily routine</span>
                      )}
                    </div>
                  </div>

                  {/* Stock status */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="text-slate-500">Remaining Stock:</span>
                    <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                      {med.stock_count || 0} pills {isLowStock && '⚠️ Low'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Since {formatDate(med.start_date)}</span>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove medication"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Occurrence Logs Table */
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-900">Audit-Ready Dose Execution History</h4>
            <span className="text-xs text-slate-500">Includes timestamp verification</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5 font-bold">Scheduled Time</th>
                  <th className="p-3.5 font-bold">Medication</th>
                  <th className="p-3.5 font-bold">Dosage</th>
                  <th className="p-3.5 font-bold">Logged Status</th>
                  <th className="p-3.5 font-bold">Recorded At</th>
                  <th className="p-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicationLogs.slice(0, 20).map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-900">
                        {new Date(log.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        <span className="text-slate-400 text-[11px]">({formatDate(log.scheduled_at)})</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {log.medication?.medicine_name || 'Prescription Dose'}
                      </td>
                      <td className="p-3.5 text-slate-600">{log.medication?.dosage || 'Standard'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          log.status === 'taken' ? 'bg-emerald-100 text-emerald-800' :
                          log.status === 'late' ? 'bg-amber-100 text-amber-800' :
                          log.status === 'missed' ? 'bg-red-100 text-red-800' :
                          log.status === 'skipped' ? 'bg-slate-100 text-slate-700' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {log.recorded_at ? new Date(log.recorded_at).toLocaleTimeString() : '—'}
                      </td>
                      <td className="p-3.5 text-right">
                        {log.status === 'upcoming' && (
                          <button
                            onClick={() => updateMedicationLog(log.id, 'taken')}
                            className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700"
                          >
                            Mark Taken
                          </button>
                        )}
                        {log.status === 'missed' && (
                          <button
                            onClick={() => updateMedicationLog(log.id, 'late')}
                            className="px-2.5 py-1 rounded-md bg-slate-800 text-white font-bold hover:bg-slate-900"
                          >
                            Take Late
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Prescribe / Add Medication" size="md">
        <form onSubmit={handleAddMedication} className="space-y-4">
          <Input
            label="Medicine Name"
            placeholder="e.g. Amlodipine, Metformin"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            label="Dosage"
            placeholder="e.g. 5mg, 500mg, 1 tablet"
            value={dosage}
            onChange={e => setDosage(e.target.value)}
            required
          />
          <Input
            label="Instructions"
            placeholder="e.g. Take with water after breakfast"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date (Optional)"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Current Stock Count"
              type="number"
              value={stockCount}
              onChange={e => setStockCount(e.target.value)}
            />
            <Input
              label="Refill Alert Limit"
              type="number"
              value={refillThreshold}
              onChange={e => setRefillThreshold(e.target.value)}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
