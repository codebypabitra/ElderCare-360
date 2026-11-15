import { useState } from 'react'
import {
  FlaskConical, AlertTriangle, Pill, Activity, ShieldAlert,
  Clock, CheckCircle2, RotateCcw, Play, Sparkles
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import type { SimulationEventType } from '@/types'

export default function SimulationLab() {
  const {
    simulationEvents,
    triggerSimulation,
    clearSimulationEvents,
    medicationLogs,
    healthReadings,
    emergencyEvents,
    getAdherenceRate,
  } = useApp()

  const [selectedEvent, setSelectedEvent] = useState<SimulationEventType>('fall_detected')

  const simulationOptions = [
    {
      type: 'missed_medication' as SimulationEventType,
      label: 'Missed Medication (Dawai Chhootna)',
      desc: 'Simulates expiry of patient 30-min grace period. Marks morning Amlodipine missed and fires an escalation alert to Priya (daughter).',
      icon: Pill,
      color: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]',
    },
    {
      type: 'fall_detected' as SimulationEventType,
      label: 'Potential Fall Detected (Gati Sensor)',
      desc: 'Simulates phone/smartwatch accelerometer spike. Starts 15s confirmation safety prompt with caregiver escalation countdown.',
      icon: AlertTriangle,
      color: 'text-[#D97706] bg-[#FEF3C7] border-[#FDE68A]',
    },
    {
      type: 'emergency_sos' as SimulationEventType,
      label: 'Emergency SOS Broadcast (Aapatkaalin)',
      desc: 'Simulates patient distress button press. Dispatches high-priority sirens across patient, family, and caregiver hubs.',
      icon: ShieldAlert,
      color: 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]',
    },
    {
      type: 'abnormal_reading' as SimulationEventType,
      label: 'Abnormal BP Spike (165 mmHg Raktachaap)',
      desc: 'Injects a hypertensive blood pressure spike into the patient telemetry log and verifies threshold excursion alerting.',
      icon: Activity,
      color: 'text-[#7C3AED] bg-[#EDE9FE] border-[#DDD6FE]',
    },
    {
      type: 'low_stock' as SimulationEventType,
      label: 'Low Medicine Stock (Dawai Khatam)',
      desc: 'Drops Calcium & D3 inventory to 2 pills and creates an automated refill task for Sunita.',
      icon: Pill,
      color: 'text-[#0F766E] bg-[#CCFBF1] border-[#99F6E4]',
    },
    {
      type: 'overdue_task' as SimulationEventType,
      label: 'Caregiver Task Overdue (Seva Vilamb)',
      desc: 'Flags a scheduled morning blood pressure check as overdue and escalates to family guardian.',
      icon: Clock,
      color: 'text-[#C2410C] bg-[#FFEDD5] border-[#FED7AA]',
    },
  ]

  const handleRunSimulation = () => {
    const opt = simulationOptions.find(o => o.type === selectedEvent)
    triggerSimulation({
      type: selectedEvent,
      patient_name: 'Mr. Ramesh Kumar (Patient #001)',
      description: opt?.desc || 'Simulated Event Triggered',
    })
  }

  const takenCount = medicationLogs.filter(l => l.status === 'taken' || l.status === 'late').length
  const missedCount = medicationLogs.filter(l => l.status === 'missed').length

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Simulation Lab & Judge Center (ପରୀକ୍ଷଣ ଗବେଷଣାଗାର)"
        subtitle="Live event generator to demonstrate real-time closed-loop care reactions without physical hardware."
        action={
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#EA580C]" />
              Interactive Hackathon Demo Mode
            </span>
          </div>
        }
      />

      {/* Verifiable Real Metrics Counter Bar */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs">
        <h3 className="text-xs font-black uppercase text-[#A8A29E] tracking-wider mb-4">
          Audit & Evaluation Metrics (Measured Across Prototype Run)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Scheduled Doses</p>
            <p className="text-xl font-black text-[#1C1917] font-serif">{medicationLogs.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Recorded Taken</p>
            <p className="text-xl font-black text-[#059669] font-serif">{takenCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Missed Doses</p>
            <p className="text-xl font-black text-[#DC2626] font-serif">{missedCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Vitals Recorded</p>
            <p className="text-xl font-black text-[#0F766E] font-serif">{healthReadings.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Emergency Events</p>
            <p className="text-xl font-black text-[#991B1B] font-serif">{emergencyEvents.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-center">
            <p className="text-xs text-[#78716C]">Simulations Run</p>
            <p className="text-xl font-black text-[#C2410C] font-serif">{simulationEvents.length}</p>
          </div>
        </div>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger Controls (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#C2410C]" />
              Event Simulator Engine
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Select an edge case scenario below and press "Trigger Event" to observe multi-role state propagation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {simulationOptions.map(opt => {
              const Icon = opt.icon
              const isSelected = selectedEvent === opt.type

              return (
                <div
                  key={opt.type}
                  onClick={() => setSelectedEvent(opt.type)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#C2410C] bg-[#FFF7ED] shadow-xs'
                      : 'border-[#EAE3D8] hover:border-[#FED7AA] bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl ${opt.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-[#1C1917]">{opt.label}</h4>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">{opt.desc}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#C2410C] text-white' : 'text-[#A8A29E]'
                    }`}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-[#EAE3D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#78716C]">
              Target Patient: <strong>Mr. Ramesh Kumar (Patient #001 · Bhubaneswar)</strong>
            </span>
            <button
              onClick={handleRunSimulation}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              Trigger Selected Simulation
            </button>
          </div>
        </div>

        {/* Live Simulator Log (1 col) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#EAE3D8] pb-3 mb-3">
                <h4 className="text-sm font-bold text-[#1C1917] font-serif flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C2410C]" />
                  Live Event Stream
                </h4>
                <button
                  onClick={clearSimulationEvents}
                  className="text-[11px] font-semibold text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Clear Log
                </button>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                {simulationEvents.length === 0 ? (
                  <p className="text-xs text-[#A8A29E] text-center py-16">
                    No simulation events triggered yet. Select an event and tap "Trigger".
                  </p>
                ) : (
                  simulationEvents.map(ev => (
                    <div key={ev.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-xs">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-[#9A3412] uppercase text-[10px] tracking-wider">
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span className="text-[#A8A29E] text-[10px]">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-[#57534E] text-[11px] leading-tight">{ev.description}</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#059669]">
                        <CheckCircle2 className="h-3 w-3" /> Processed & Broadcasted
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE3D8] text-[11px] text-[#A8A29E] text-center">
              Changes reflect immediately on Patient & Family screens.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
