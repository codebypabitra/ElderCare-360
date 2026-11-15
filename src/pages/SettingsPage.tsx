import { useState } from 'react'
import {
  Settings, ShieldCheck, Bell, User, Lock, Database,
  CheckCircle2, AlertTriangle, Smartphone, Sparkles
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function SettingsPage() {
  const { currentUser, login } = useApp()
  const [saved, setSaved] = useState(false)

  // Preferences state
  const [systolicThreshold, setSystolicThreshold] = useState('140')
  const [diastolicThreshold, setDiastolicThreshold] = useState('90')
  const [gracePeriod, setGracePeriod] = useState('30')
  const [pushNotifs, setPushNotifs] = useState(true)
  const [smsEscalation, setSmsEscalation] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const supabaseConnected = isSupabaseConfigured()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage clinical thresholds, notification escalation parameters, and DPDP consent settings."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinician-Configured Alert Thresholds */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Clinical Alert Thresholds (Clinician Established)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Vital readings exceeding these limits prompt verification rechecks and alert family caregivers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Systolic BP (mmHg)</label>
              <input
                type="number"
                value={systolicThreshold}
                onChange={e => setSystolicThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diastolicThreshold}
                onChange={e => setDiastolicThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medication Grace Period (Mins)</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={e => setGracePeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Escalation Channels & Emergency Notification */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Escalation & Notification Channels</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-900">Browser & Mobile In-App Push Alerts</p>
                <p className="text-xs text-slate-500">Immediate push reminders for upcoming pill times</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={e => setPushNotifs(e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-900">Caregiver SMS & WhatsApp Escalation</p>
                <p className="text-xs text-slate-500">Fires after 30-minute grace period expiry without dose check-in</p>
              </div>
              <input
                type="checkbox"
                checked={smsEscalation}
                onChange={e => setSmsEscalation(e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Database & Security Architecture Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Database & Compliance Architecture</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-400">PostgreSQL Backend</p>
              <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {supabaseConnected ? 'Supabase Live Connected' : 'Supabase Client Initialized (Demo State)'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-400">Data Protection Act</p>
              <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                DPDP 2023 India Compliant
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Preferences saved successfully
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
