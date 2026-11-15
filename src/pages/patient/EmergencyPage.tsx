import { useState, useEffect } from 'react'
import {
  AlertTriangle, ShieldAlert, Phone, CheckCircle2,
  Flame, BellRing, HeartPulse, User
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
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Aapatkaalin Suraksha & SOS (ଆପାତକାଳୀନ ସୁରକ୍ଷା)"
        subtitle="Priority emergency escalation, simulated fall detection, and care circle broadcast."
      />

      {/* Main Indian SOS Dignified Action Card */}
      <div className="rounded-3xl border-2 border-[#FECACA] bg-gradient-to-b from-[#FEF2F2] via-white to-[#FEF2F2] p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-[#FEE2E2] text-[#991B1B] uppercase tracking-widest mb-4 border border-[#FECACA]">
            <Flame className="h-4 w-4 text-[#DC2626] animate-pulse" />
            Turant Sahayata (Immediate Dispatch)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight mb-2 font-serif">
            Aapatkaalin SOS Button
          </h2>
          <p className="text-[#57534E] text-sm mb-8 leading-relaxed">
            Pressing this button initiates an urgent broadcast to your daughter <strong>Priya (Bengaluru)</strong>, attendant <strong>Sunita</strong>, and <strong>Dr. Anil Sharma</strong>.
          </p>

          <button
            onClick={() => setSosModalOpen(true)}
            className="group relative inline-flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-gradient-to-tr from-[#B91C1C] via-[#DC2626] to-[#EF4444] text-white font-black text-xl sm:text-2xl shadow-xl shadow-[#DC2626]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white"
          >
            <span className="absolute inset-0 rounded-full bg-[#DC2626] animate-ping opacity-20 pointer-events-none"></span>
            <div className="flex flex-col items-center">
              <ShieldAlert className="h-10 w-10 sm:h-12 sm:w-12 mb-1" />
              <span>SOS</span>
              <span className="text-[10px] font-bold tracking-widest text-red-100 uppercase">सहायता</span>
            </div>
          </button>

          <p className="text-xs text-[#78716C] mt-8 font-medium">
            Protected by false-alarm confirmation · Aligned with India Senior Citizen Safety Guidelines
          </p>
        </div>
      </div>

      {/* Fall Detection Sensor Simulation Card */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFEDD5] text-[#9A3412]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917] font-serif">
                Accelerometer Fall Detection Simulation (ଗତି ସେନ୍ସର)
              </h3>
            </div>
            <p className="text-xs text-[#78716C] mt-1">
              Simulates a sudden high-velocity downward fall followed by lack of movement.
            </p>
          </div>

          {!fallActive && (
            <button
              onClick={startFallSimulation}
              className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#1C1917] font-black text-xs shadow-xs transition-all cursor-pointer"
            >
              Simulate Motion Fall Event
            </button>
          )}
        </div>

        {/* Active Fall Countdown Banner */}
        {fallActive && fallCountdown !== null && (
          <div className="p-6 rounded-2xl bg-[#FFFBEB] border-2 border-[#FCD34D] text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#F59E0B] text-[#1C1917] font-black text-2xl shadow-sm">
              {fallCountdown}s
            </div>
            <div>
              <h4 className="text-xl font-black text-[#78350F] font-serif">POTENTIAL FALL IMPACT DETECTED!</h4>
              <p className="text-sm text-[#92400E] mt-1">
                Ramesh Ji, are you unhurt? If you do not respond, your caregiver Sunita and Priya will be alerted in {fallCountdown} seconds.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelFall}
                className="px-6 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm shadow-sm cursor-pointer"
              >
                MAIN THEEK HOON (I AM OK) ✓
              </button>
              <button
                onClick={() => {
                  triggerFallDetection()
                  cancelFall()
                }}
                className="px-6 py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-sm shadow-sm cursor-pointer"
              >
                SAHAYATA CHAHIYE (ESCALATE NOW)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Registered Emergency Contacts & Live Incident History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Contacts */}
        <div className="lg:col-span-1 rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-[#1C1917] font-serif flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-[#C2410C]" />
            Aapatkaalin Parivaar Contacts
          </h3>
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border border-[#EAE3D8] bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#1C1917]">{c.contact_name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#9A3412]">
                      Priority {c.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-0.5">{c.relationship} · {c.phone}</p>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="p-2.5 rounded-xl bg-[#ECFDF5] text-[#047857] hover:bg-[#D1FAE5] transition-colors"
                  title="Direct Call"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Events Log */}
        <div className="lg:col-span-2 rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-[#1C1917] font-serif flex items-center gap-2 mb-4">
            <BellRing className="h-5 w-5 text-[#DC2626]" />
            Aapatkaalin Incident Audit Log
          </h3>

          <div className="space-y-3">
            {emergencyEvents.length === 0 ? (
              <p className="text-sm text-[#78716C] py-8 text-center">No emergency incidents recorded. All safe!</p>
            ) : (
              emergencyEvents.map(event => {
                const isOpen = event.status === 'open'
                const isAck = event.status === 'acknowledged'
                const isResolved = event.status === 'resolved'

                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-[#FEF2F2] border-[#FECACA]'
                        : isAck
                        ? 'bg-[#FFFBEB] border-[#FDE68A]'
                        : 'bg-[#FAF8F5] border-[#EAE3D8]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            isOpen ? 'bg-[#DC2626] text-white' :
                            isAck ? 'bg-[#F59E0B] text-white' :
                            'bg-[#059669] text-white'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wide">
                            {event.event_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#1C1917] mt-1">
                          {event.description || 'Distress Event Triggered'}
                        </p>
                        <p className="text-xs text-[#78716C] mt-0.5">
                          Time: {formatDate(event.created_at)} at{' '}
                          {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOpen && (
                          <button
                            onClick={() => acknowledgeEmergency(event.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#1C1917] text-xs font-bold cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!isResolved && (
                          <button
                            onClick={() => resolveEmergency(event.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer"
                          >
                            Resolve Event ✓
                          </button>
                        )}
                        {isResolved && (
                          <span className="text-xs font-semibold text-[#047857] flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-[#DC2626] text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-[#1C1917] font-serif">CONFIRM EMERGENCY DISPATCH</h3>
            <p className="text-sm text-[#57534E]">
              Are you sure you want to trigger the SOS alarm? This will immediately broadcast distress messages to Priya, Sunita, and Dr. Sharma.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  triggerSOS('Patient Ramesh Ji pressed emergency distress SOS button')
                  setSosModalOpen(false)
                }}
                className="w-full py-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-base shadow-lg cursor-pointer"
              >
                HAAN, TURANT SOS BHEJEIN
              </button>
              <button
                onClick={() => setSosModalOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-[#F5F1EB] hover:bg-[#EAE3D8] text-[#44403C] font-bold text-sm cursor-pointer"
              >
                Galti Se Daba (Cancel False Alarm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
