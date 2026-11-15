import { useState } from 'react'
import {
  Heart, Activity, Wind, Droplets, Thermometer, Scale, Plus,
  Sparkles, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown,
  Calendar, Info
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { METRIC_CONFIG, type MetricType } from '@/types'
import { formatDate } from '@/lib/utils'

export default function HealthPage() {
  const { healthReadings, addHealthReading, addNotification } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'bp' | 'heart' | 'spo2' | 'glucose'>('bp')

  // Form states
  const [metricType, setMetricType] = useState<MetricType>('blood_pressure_systolic')
  const [metricValue, setMetricValue] = useState('')
  const [metricTime, setMetricTime] = useState(new Date().toISOString().slice(0, 16))

  const handleRecordReading = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(metricValue)
    if (isNaN(val)) return

    const conf = METRIC_CONFIG[metricType]
    addHealthReading({
      patient_id: 'patient-001',
      metric_type: metricType,
      value: val,
      unit: conf.unit,
      recorded_at: new Date(metricTime).toISOString(),
    })

    // Check if out of range
    if (val < conf.normalRange.min || val > conf.normalRange.max) {
      addNotification({
        user_id: 'user-family-001',
        title: `⚠️ Out of Range: ${conf.label}`,
        message: `${conf.label} reading was recorded as ${val} ${conf.unit} (Normal range: ${conf.normalRange.min}-${conf.normalRange.max})`,
        type: 'health_alert',
      })
    }

    setMetricValue('')
    setModalOpen(false)
  }

  // Prepare chart dataset (group by date)
  const chartDataMap: Record<string, any> = {}
  healthReadings.forEach(r => {
    const d = new Date(r.recorded_at)
    const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    if (!chartDataMap[key]) {
      chartDataMap[key] = { date: key }
    }
    if (r.metric_type === 'blood_pressure_systolic') chartDataMap[key].systolic = r.value
    if (r.metric_type === 'blood_pressure_diastolic') chartDataMap[key].diastolic = r.value
    if (r.metric_type === 'heart_rate') chartDataMap[key].heartRate = r.value
    if (r.metric_type === 'spo2') chartDataMap[key].spo2 = r.value
    if (r.metric_type === 'blood_glucose') chartDataMap[key].glucose = r.value
  })

  const chartData = Object.values(chartDataMap).slice(-10)

  // Quick stats by metric
  const getLatest = (type: MetricType) => {
    const list = healthReadings.filter(r => r.metric_type === type)
    return list[list.length - 1]
  }

  const latestSys = getLatest('blood_pressure_systolic')
  const latestDia = getLatest('blood_pressure_diastolic')
  const latestHR = getLatest('heart_rate')
  const latestSpO2 = getLatest('spo2')
  const latestSugar = getLatest('blood_glucose')
  const latestTemp = getLatest('temperature')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Vitals Telemetry"
        subtitle="Continuous monitoring, physiological trend curves, and clinician-defined thresholds."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Record Vital Reading
          </button>
        }
      />

      {/* Vital Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Blood Pressure */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-red-500" /> Blood Pressure
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                In Safe Zone
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {latestSys ? latestSys.value : 124} / {latestDia ? latestDia.value : 80}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mmHg</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target Clinician Range: 90-140 / 60-90 mmHg</p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
            Recorded: {latestSys ? formatDate(latestSys.recorded_at) : 'Today'}
          </div>
        </div>

        {/* Heart Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-pink-500" /> Pulse / Heart Rate
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Normal Rhythm
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {latestHR ? latestHR.value : 72}
              </span>
              <span className="text-xs text-slate-500 font-semibold">bpm</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target Clinician Range: 60 - 100 bpm</p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
            Recorded: {latestHR ? formatDate(latestHR.recorded_at) : 'Today'}
          </div>
        </div>

        {/* SpO2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-blue-500" /> Blood Oxygen (SpO2)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Optimal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {latestSpO2 ? latestSpO2.value : 98}
              </span>
              <span className="text-xs text-slate-500 font-semibold">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target Clinician Range: 95 - 100%</p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
            Recorded: {latestSpO2 ? formatDate(latestSpO2.recorded_at) : 'Today'}
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-purple-500" /> Blood Glucose
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Fasting Normal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {latestSugar ? latestSugar.value : 112}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target Clinician Range: 70 - 140 mg/dL</p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
            Recorded: {latestSugar ? formatDate(latestSugar.recorded_at) : 'Yesterday'}
          </div>
        </div>

        {/* Temperature */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-amber-500" /> Body Temp
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Afebrile
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {latestTemp ? latestTemp.value.toFixed(1) : '98.4'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">°F</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Target Clinician Range: 97.0 - 99.5 °F</p>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3 text-[11px] text-slate-400">
            Recorded: {latestTemp ? formatDate(latestTemp.recorded_at) : '2 days ago'}
          </div>
        </div>

        {/* Clinical Note Card */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Dr. Anil's Clinical Guideline
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Maintain morning blood pressure recordings within 30 minutes of waking and prior to breakfast. Notify clinic immediately if systolic exceeds 160 mmHg on two consecutive tests."
            </p>
          </div>
          <div className="text-[11px] font-semibold text-blue-600 pt-3 border-t border-blue-200/60">
            Last Clinical Review: Nov 12, 2026
          </div>
        </div>
      </div>

      {/* Dynamic Visual Trend Chart with Recharts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              10-Day Physiological Trajectory
            </h3>
            <p className="text-xs text-slate-500">Historical telemetry plotted against safety thresholds</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedTab('bp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'bp' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setSelectedTab('heart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'heart' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Heart Rate
            </button>
            <button
              onClick={() => setSelectedTab('spo2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'spo2' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              SpO2 Oxygen
            </button>
            <button
              onClick={() => setSelectedTab('glucose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTab === 'glucose' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Glucose
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />

              {selectedTab === 'bp' && (
                <>
                  <ReferenceLine y={140} label="Max Systolic Threshold" stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={90} label="Min Systolic" stroke="#3b82f6" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} name="Systolic (mmHg)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#f97316" strokeWidth={3} name="Diastolic (mmHg)" dot={{ r: 4 }} />
                </>
              )}

              {selectedTab === 'heart' && (
                <>
                  <ReferenceLine y={100} label="Max Normal (100)" stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={60} label="Min Normal (60)" stroke="#3b82f6" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="heartRate" stroke="#ec4899" strokeWidth={3} name="Heart Rate (bpm)" dot={{ r: 4 }} />
                </>
              )}

              {selectedTab === 'spo2' && (
                <>
                  <ReferenceLine y={95} label="Hypoxia Threshold (95%)" stroke="#ef4444" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="spo2" stroke="#3b82f6" strokeWidth={3} name="Oxygen Saturation (%)" dot={{ r: 4 }} />
                </>
              )}

              {selectedTab === 'glucose' && (
                <>
                  <ReferenceLine y={140} label="Post-Meal Upper Bound" stroke="#f59e0b" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="glucose" stroke="#8b5cf6" strokeWidth={3} name="Blood Glucose (mg/dL)" dot={{ r: 4 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reading Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-900">Recent Vitals Log Archive</h4>
          <span className="text-xs text-slate-500">Sorted chronologically</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">Recorded Date & Time</th>
                <th className="p-3.5 font-bold">Vital Indicator</th>
                <th className="p-3.5 font-bold">Measurement</th>
                <th className="p-3.5 font-bold">Clinical Normal Range</th>
                <th className="p-3.5 font-bold">Safety Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {healthReadings.slice(-15).reverse().map(r => {
                const conf = METRIC_CONFIG[r.metric_type]
                const inRange = r.value >= conf.normalRange.min && r.value <= conf.normalRange.max

                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-900">{formatDate(r.recorded_at)}</td>
                    <td className="p-3.5 font-bold text-slate-900">{conf.label}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {r.value} {r.unit}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {conf.normalRange.min} - {conf.normalRange.max} {r.unit}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        inRange ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {inRange ? 'Within Limits' : '⚠️ Alert: Out of Limits'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to log reading */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Health Metric Reading" size="md">
        <form onSubmit={handleRecordReading} className="space-y-4">
          <Select
            label="Metric Type"
            value={metricType}
            onChange={e => setMetricType(e.target.value as MetricType)}
            options={[
              { value: 'blood_pressure_systolic', label: 'Blood Pressure — Systolic (mmHg)' },
              { value: 'blood_pressure_diastolic', label: 'Blood Pressure — Diastolic (mmHg)' },
              { value: 'heart_rate', label: 'Heart Rate (bpm)' },
              { value: 'spo2', label: 'Oxygen Saturation SpO2 (%)' },
              { value: 'blood_glucose', label: 'Blood Glucose (mg/dL)' },
              { value: 'temperature', label: 'Body Temperature (°F)' },
            ]}
          />

          <Input
            label={`Measurement Value (${METRIC_CONFIG[metricType].unit})`}
            type="number"
            step="any"
            placeholder={`e.g. ${METRIC_CONFIG[metricType].normalRange.min + 10}`}
            value={metricValue}
            onChange={e => setMetricValue(e.target.value)}
            required
          />

          <Input
            label="Timestamp"
            type="datetime-local"
            value={metricTime}
            onChange={e => setMetricTime(e.target.value)}
            required
          />

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
              Save Vital Reading
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
