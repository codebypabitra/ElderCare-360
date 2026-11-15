import { useState } from 'react'
import {
  Pill, Plus, AlertTriangle, CheckCircle2, Clock, Trash2,
  Calendar, RotateCcw, Filter, AlertCircle, Sparkles, Coffee, Sun, Moon
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatTime, formatDate } from '@/lib/utils'

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
      patient_id: 'e1a1b1c1-0001-4000-8000-000000000001',
      medicine_name: name,
      dosage,
      instructions: instructions || 'Subah naashte ke baad paani ke saath',
      start_date: startDate,
      end_date: endDate || undefined,
      status: 'active',
      stock_count: parseInt(stockCount) || 30,
      refill_threshold: parseInt(refillThreshold) || 7,
    })

    setName('')
    setDosage('')
    setInstructions('')
    setStockCount('30')
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Dawai Niyam & Inventory (ଔଷଧ ତାଲିକା)"
        subtitle="Medicine schedules, meal-time reminders, stock refill alerts, and missed-dose escalations."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nayi Dawai Jodein (Add Medicine)
          </button>
        }
      />

      {/* Adherence & Stock Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <ProgressRing value={adherence} size={110} strokeWidth={10} label="Niyamit" color="#C2410C" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C2410C] uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              Smart Adherence Telemetry
            </div>
            <h3 className="text-lg font-bold text-[#1C1917] font-serif">
              {adherence >= 85 ? 'Uttam Niyamitata (Excellent Routine)' : 'Care Circle Intervention Recommended'}
            </h3>
            <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
              Calculated using: [Recorded as taken / Total doses due] × 100.
              Late doses are highlighted separately to ensure caregiver accuracy.
            </p>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#9A3412] font-bold text-sm mb-2">
              <AlertTriangle className="h-5 w-5 text-[#EA580C]" />
              Dawai Stock & Refill Alerts
            </div>
            <div className="space-y-2 mt-3">
              {medications.filter(m => (m.stock_count || 0) <= (m.refill_threshold || 7)).map(m => (
                <div key={m.id} className="text-xs flex justify-between items-center text-[#9A3412] font-medium bg-white/80 border border-[#FED7AA] px-3 py-1.5 rounded-xl">
                  <span className="font-bold">{m.medicine_name}</span>
                  <span className="text-[#DC2626] font-bold">{m.stock_count} bache hain (Refill Soon)</span>
                </div>
              ))}
              {medications.filter(m => (m.stock_count || 0) <= (m.refill_threshold || 7)).length === 0 && (
                <p className="text-xs text-[#047857] font-medium">All medicines have sufficient supply.</p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-[#9A3412]/80 mt-4">Automated notification sent to Priya & Sunita when supply drops below 7 doses.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE3D8] pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'text-[#57534E] hover:bg-[#F5F1EB]'
          }`}
        >
          Active Prescriptions ({medications.filter(m => m.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'text-[#57534E] hover:bg-[#F5F1EB]'
          }`}
        >
          All History ({medications.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'text-[#57534E] hover:bg-[#F5F1EB]'
          }`}
        >
          Dose Execution Logs ({medicationLogs.length})
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
                className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#FED7AA] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center font-bold">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#1C1917] font-serif">{med.medicine_name}</h4>
                        <span className="text-xs font-semibold text-[#C2410C]">{med.dosage}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      med.status === 'active'
                        ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                        : 'bg-[#F5F1EB] text-[#78716C]'
                    }`}>
                      {med.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#57534E] bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE3D8] mb-3 leading-relaxed">
                    {med.instructions || 'Subah naashte ke baad paani ke saath lein'}
                  </p>

                  {/* Scheduled times */}
                  <div className="space-y-1.5 mb-3">
                    <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider">Scheduled Times (समय)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {medSchedules.map(s => (
                        <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF7ED] text-[#9A3412] text-xs font-bold border border-[#FED7AA]">
                          <Clock className="h-3 w-3" />
                          {formatTime(s.scheduled_time)} ({s.frequency})
                        </span>
                      ))}
                      {medSchedules.length === 0 && (
                        <span className="text-xs text-[#A8A29E]">Daily routine</span>
                      )}
                    </div>
                  </div>

                  {/* Stock status */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-[#EAE3D8]">
                    <span className="text-[#78716C]">Remaining Stock:</span>
                    <span className={`font-bold ${isLowStock ? 'text-[#DC2626]' : 'text-[#1C1917]'}`}>
                      {med.stock_count || 0} tablets {isLowStock && '⚠️ Kam bachi hai'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#EAE3D8] flex items-center justify-between">
                  <span className="text-[11px] text-[#A8A29E]">From {formatDate(med.start_date)}</span>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
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
        <div className="rounded-3xl border border-[#EAE3D8] bg-white overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#EAE3D8] bg-[#FAF8F5] flex justify-between items-center">
            <h4 className="text-sm font-bold text-[#1C1917] font-serif">Audit-Ready Dose Execution History</h4>
            <span className="text-xs text-[#78716C]">Includes timestamp verification</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#78716C] uppercase border-b border-[#EAE3D8]">
                <tr>
                  <th className="p-4 font-bold">Scheduled Time</th>
                  <th className="p-4 font-bold">Medication</th>
                  <th className="p-4 font-bold">Dosage</th>
                  <th className="p-4 font-bold">Logged Status</th>
                  <th className="p-4 font-bold">Recorded At</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D8]">
                {medicationLogs.slice(0, 20).map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-4 font-semibold text-[#1C1917]">
                        {new Date(log.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        <span className="text-[#A8A29E] text-[11px]">({formatDate(log.scheduled_at)})</span>
                      </td>
                      <td className="p-4 font-bold text-[#1C1917]">
                        {log.medication?.medicine_name || 'Prescription Dose'}
                      </td>
                      <td className="p-4 text-[#57534E]">{log.medication?.dosage || 'Standard'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          log.status === 'taken' ? 'bg-[#DCFCE7] text-[#15803D]' :
                          log.status === 'late' ? 'bg-[#FEF3C7] text-[#B45309]' :
                          log.status === 'missed' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                          'bg-[#E0F2FE] text-[#0369A1]'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#78716C]">
                        {log.recorded_at ? new Date(log.recorded_at).toLocaleTimeString() : '—'}
                      </td>
                      <td className="p-4 text-right">
                        {log.status === 'upcoming' && (
                          <button
                            onClick={() => updateMedicationLog(log.id, 'taken')}
                            className="px-3 py-1 rounded-xl bg-[#C2410C] text-white font-bold hover:bg-[#9A3412] cursor-pointer"
                          >
                            Mark Taken
                          </button>
                        )}
                        {log.status === 'missed' && (
                          <button
                            onClick={() => updateMedicationLog(log.id, 'late')}
                            className="px-3 py-1 rounded-xl bg-[#1C1917] text-white font-bold hover:bg-[#292524] cursor-pointer"
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Prescribe / Add Medication (नयी दवाई जोड़ें)" size="md">
        <form onSubmit={handleAddMedication} className="space-y-4">
          <Input
            label="Dawai ka Naam (Medicine Name)"
            placeholder="e.g. Amlodipine, Metformin, Telmisartan"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            label="Khurak (Dosage)"
            placeholder="e.g. 5mg, 500mg, 1 tablet"
            value={dosage}
            onChange={e => setDosage(e.target.value)}
            required
          />
          <Input
            label="Instructions / Nirdesh"
            placeholder="e.g. Subah naashte ke baad paani ke saath"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Shuru Hone ki Taarikh"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <Input
              label="Antim Taarikh (Optional)"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Current Tablet Count"
              type="number"
              value={stockCount}
              onChange={e => setStockCount(e.target.value)}
            />
            <Input
              label="Refill Alert Level"
              type="number"
              value={refillThreshold}
              onChange={e => setRefillThreshold(e.target.value)}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#EAE3D8] text-[#57534E] font-semibold text-xs cursor-pointer"
            >
              Radd Karein (Cancel)
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Surakshit Karein (Save Dawai)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
