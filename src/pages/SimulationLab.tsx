import { useState } from 'react'
import {
  FlaskConical, AlertTriangle, Pill, Activity, ShieldAlert,
  Flame, Clock, CheckCircle2, RotateCcw, Play, Sparkles, TrendingUp
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
    careTasks,
    getAdherenceRate,
  } = useApp()

  const [selectedEvent, setSelectedEvent] = useState<SimulationEventType>('fall_detected')

  const simulationOptions = [
    {
      type: 'missed_medication' as SimulationEventType,
      label: 'Missed Medication Dose',
      desc: 'Simulates expiry of patient grace period. Marks an active dose as missed and fires an escalation alert to Priya (daughter).',
      icon: Pill,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      type: 'fall_detected' as SimulationEventType,
      label: 'Potential Fall Detected',
      desc: 'Simulates wearable/phone accelerometer spike. Starts 15s confirmation safety prompt with caregiver escalation countdown.',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      type: 'emergency_sos' as SimulationEventType,
      label: 'Emergency SOS Broadcast',
      desc: 'Simulates patient distress button press. Dispatches high-priority sirens across patient, family, and caregiver hubs.',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      type: 'abnormal_reading' as SimulationEventType,
      label: 'Abnormal Health Reading (BP 165 mmHg)',
      desc: 'Injects a hypertensive blood pressure spike into the patient telemetry log and verifies threshold excursion alerting.',
      icon: Activity,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      type: 'low_stock' as SimulationEventType,
      label: 'Low Medicine Stock Alert',
      desc: 'Drops Calcium & D3 inventory to 2 pills and creates an automated refill task for the attendant.',
      icon: Pill,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      type: 'overdue_task' as SimulationEventType,
      label: 'Caregiver Task Overdue',
      desc: 'Flags a scheduled morning blood pressure check as overdue and escalates to family guardian.',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
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

  // Hackathon verifiable metrics
  const adherence = getAdherenceRate()
  const takenCount = medicationLogs.filter(l => l.status === 'taken' || l.status === 'late').length
  const missedCount = medicationLogs.filter(l => l.status === 'missed').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulation-Only Innovation Lab & Judge Center"
        subtitle="Live event generator to demonstrate real-time closed-loop care reactions without physical hardware."
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Interactive Hackathon Demo Mode
            </span>
          </div>
        }
      />

      {/* Verifiable Real Metrics Counter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
          Audit & Evaluation Metrics (Measured Across Prototype Run)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Scheduled Doses</p>
            <p className="text-xl font-black text-slate-900">{medicationLogs.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Recorded Taken</p>
            <p className="text-xl font-black text-emerald-600">{takenCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Missed Doses</p>
            <p className="text-xl font-black text-red-600">{missedCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Vitals Recorded</p>
            <p className="text-xl font-black text-blue-600">{healthReadings.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Emergency Incidents</p>
            <p className="text-xl font-black text-rose-600">{emergencyEvents.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-center">
            <p className="text-xs text-slate-500">Simulations Run</p>
            <p className="text-xl font-black text-indigo-600">{simulationEvents.length}</p>
          </div>
        </div>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger Controls (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-indigo-600" />
              Event Simulator Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an edge case scenario below and press "Trigger Event" to observe multi-role state propagation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {simulationOptions.map(opt => {
              const Icon = opt.icon
              const isSelected = selectedEvent === opt.type

              return (
                <div
                  key={opt.type}
                  onClick={() => setSelectedEvent(opt.type)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-lg ${opt.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{opt.label}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Target Patient: <strong>Mr. Ramesh Kumar (Patient #001)</strong>
            </span>
            <button
              onClick={handleRunSimulation}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              Trigger Selected Simulation
            </button>
          </div>
        </div>

        {/* Live Simulator Log (1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  Live Event Stream
                </h4>
                <button
                  onClick={clearSimulationEvents}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Clear Log
                </button>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                {simulationEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-16">
                    No simulation events triggered yet. Select an event and tap "Trigger".
                  </p>
                ) : (
                  simulationEvents.map(ev => (
                    <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-indigo-950 uppercase text-[10px] tracking-wider">
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-tight">{ev.description}</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Processed & Broadcasted
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Changes reflect immediately on Patient & Family screens.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
