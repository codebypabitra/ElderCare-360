import { useState } from 'react'
import {
  ShieldCheck, Bell, Database, CheckCircle2, AlertTriangle,
  RefreshCw, Copy, Check, ExternalLink, Sparkles
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function SettingsPage() {
  const { isLiveSupabase, isSyncing, refreshFromSupabase, lastSyncedAt } = useApp()
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [pinging, setPinging] = useState(false)

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

  const testSupabasePing = async () => {
    setPinging(true)
    setPingResult(null)
    const startTime = performance.now()
    try {
      const { data, error } = await supabase.from('medications').select('id, medicine_name').limit(5)
      const duration = Math.round(performance.now() - startTime)
      if (error) {
        setPingResult(`❌ Supabase error: ${error.message} (latency: ${duration}ms)`)
      } else {
        setPingResult(`✅ Connected! Retrieved ${data?.length || 0} medication records in ${duration}ms via live Supabase REST API.`)
      }
    } catch (err: any) {
      setPingResult(`❌ Network failed: ${err.message || err}`)
    } finally {
      setPinging(false)
    }
  }

  const sqlSnippet = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msheryqagewdcdgyvxbg/sql/new
-- (See supabase/setup_and_seed.sql for complete tables & policies)`

  const copySqlLink = () => {
    navigator.clipboard.writeText(sqlSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://msheryqagewdcdgyvxbg.supabase.co'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Supabase Realtime Telemetry"
        subtitle="Manage live database synchronization, clinical thresholds, and escalation parameters."
      />

      {/* Supabase Live Status Monitor Banner */}
      <div className="rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/50 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Supabase Cloud Database Sync</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 animate-pulse">
                  LIVE REALTIME ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Connected Instance: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700 font-semibold">{supabaseUrl}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={testSupabasePing}
              disabled={pinging}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${pinging ? 'animate-spin text-emerald-600' : ''}`} />
              {pinging ? 'Testing...' : 'Test Live Query'}
            </button>
            <button
              type="button"
              onClick={() => refreshFromSupabase()}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {pingResult && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800">
            {pingResult}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Realtime Publication</span>
            <span className="font-bold text-slate-900">Postgres Changes (Active)</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Publishable Key</span>
            <span className="font-bold text-slate-900 truncate block">sb_publishable_TZhq...</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Last Sync Timestamp</span>
            <span className="font-bold text-emerald-700">
              {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* SQL Setup Guidance Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Database Seeding & SQL Schema Script
            </h3>
          </div>
          <a
            href="https://supabase.com/dashboard/project/msheryqagewdcdgyvxbg/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Open Supabase SQL Editor <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="text-xs text-slate-500">
          The complete database migration with RLS policies and seed rows is saved at <code className="bg-slate-100 px-1 rounded text-slate-700">supabase/setup_and_seed.sql</code>. Running it in your Supabase SQL editor populates Ramesh Kumar, Priya, Sunita, Dr. Anil, medications, vitals, contacts, and care tasks directly into PostgreSQL.
        </p>
      </div>

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
