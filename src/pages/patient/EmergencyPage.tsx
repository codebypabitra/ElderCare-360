import { useState, useEffect } from 'react'
import {
  AlertTriangle, ShieldAlert, Phone, CheckCircle2, Clock,
  RefreshCw, UserCheck, Flame, BellRing, HeartPulse
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatDate } from '@/lib/utils'

export default function EmergencyPage() {
  const {
    emergencyEvents,
    triggerSOS,
    triggerFallDetection,
    resolveEmergency,
    acknowledgeEmergency,
    getEmergencyContacts,
  } = useApp()

  const contacts = getEmergencyContacts()
  const [sosModalOpen, setSosModalOpen] = useState(false)

  // Fall detection simulation state
  const [fallCountdown, setFallCountdown] = useState<number | null>(null)
  const [fallActive, setFallActive] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (fallCountdown !== null && fallCountdown > 0) {
      timer = setTimeout(() => {
        setFallCountdown(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
    } else if (fallCountdown === 0) {
      // Countdown expired: escalate to caregiver
      triggerFallDetection()
      setFallActive(false)
      setFallCountdown(null)
    }
    return () => clearTimeout(timer)
  }, [fallCountdown, triggerFallDetection])

  const startFallSimulation = () => {
    setFallActive(true)
    setFallCountdown(15) // 15-second responsive demo timer
  }

  const cancelFall = () => {
    setFallActive(false)
    setFallCountdown(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Coordination & SOS Engine"
        subtitle="Distress escalation, simulated fall detection verification, and caregiver broadcast."
      />

      {/* Main SOS Action Card */}
      <div className="rounded-3xl border-2 border-red-500/80 bg-gradient-to-b from-red-50/50 via-white to-red-50/30 p-8 text-center shadow-xl shadow-red-500/10 relative overflow-hidden">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 uppercase tracking-widest mb-4">
            <Flame className="h-4 w-4 text-red-600 animate-pulse" />
            Immediate Assistance Dispatch
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
            Patient Distress SOS
          </h2>
          <p className="text-slate-600 text-sm mb-8">
            Pressing this button activates a priority emergency event and immediately dials / messages all 3 registered care circle members.
          </p>

          <button
            onClick={() => setSosModalOpen(true)}
            className="group relative inline-flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white font-black text-xl sm:text-2xl shadow-2xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white"
          >
            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25 pointer-events-none"></span>
            <div className="flex flex-col items-center">
              <ShieldAlert className="h-10 w-10 sm:h-12 sm:w-12 mb-1" />
              <span>SOS</span>
              <span className="text-[10px] font-bold tracking-widest text-red-100 uppercase">Emergency</span>
            </div>
          </button>

          <p className="text-xs text-slate-400 mt-6 font-medium">
            Protected by false-trigger confirmation · Compliant with DPDP emergency safety standards
          </p>
        </div>
      </div>

      {/* Fall Detection Sensor Simulation Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Accelerometer Fall Detection Simulation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Simulates a sudden high-velocity downward acceleration event followed by immobility.
            </p>
          </div>

          {!fallActive && (
            <button
              onClick={startFallSimulation}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              Simulate Motion Fall Event
            </button>
          )}
        </div>

        {/* Active Fall Countdown Banner */}
        {fallActive && fallCountdown !== null && (
          <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-400 text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-500 text-slate-950 font-black text-2xl shadow-lg">
              {fallCountdown}s
            </div>
            <div>
              <h4 className="text-xl font-black text-amber-950">POTENTIAL FALL IMPACT DETECTED!</h4>
              <p className="text-sm text-amber-900 mt-1">
                Mr. Ramesh, are you unhurt? If you do not respond, your caregiver will be notified in {fallCountdown} seconds.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelFall}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md"
              >
                I AM OK (Dismiss Alarm) ✓
              </button>
              <button
                onClick={() => {
                  triggerFallDetection()
                  cancelFall()
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md"
              >
                I NEED HELP (Escalate Now)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Registered Emergency Contacts & Live Incident History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Contacts */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-blue-600" />
            Registered Care Contacts
          </h3>
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{c.contact_name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Priority {c.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{c.relationship} · {c.phone}</p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                  title="Direct Call"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Events Log */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <BellRing className="h-5 w-5 text-red-600" />
            Emergency Incident Audit Log
          </h3>

          <div className="space-y-3">
            {emergencyEvents.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No emergency incidents recorded.</p>
            ) : (
              emergencyEvents.map(event => {
                const isOpen = event.status === 'open'
                const isAck = event.status === 'acknowledged'
                const isResolved = event.status === 'resolved'

                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isOpen
                        ? 'bg-red-50/60 border-red-300'
                        : isAck
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            isOpen ? 'bg-red-600 text-white' :
                            isAck ? 'bg-amber-500 text-white' :
                            'bg-emerald-600 text-white'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                            {event.event_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 mt-1">
                          {event.description || 'Distress Event Triggered'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Triggered: {formatDate(event.created_at)} at{' '}
                          {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOpen && (
                          <button
                            onClick={() => acknowledgeEmergency(event.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!isResolved && (
                          <button
                            onClick={() => resolveEmergency(event.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Resolve Event ✓
                          </button>
                        )}
                        {isResolved && (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Incident Cleared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-red-600 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">CONFIRM EMERGENCY DISPATCH</h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to trigger the SOS alarm? This will immediately broadcast to family, caregiver, and clinical staff.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  triggerSOS('Patient pressed emergency distress SOS button')
                  setSosModalOpen(false)
                }}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg cursor-pointer"
              >
                YES, BROADCAST DISTRESS ALERT NOW
              </button>
              <button
                onClick={() => setSosModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Cancel (False Alarm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
