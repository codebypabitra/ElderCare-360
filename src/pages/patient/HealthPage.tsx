import { useState } from 'react'
import {
  Heart, Activity, Wind, Droplets, Thermometer, Plus,
  Sparkles, TrendingUp
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
      patient_id: 'e1a1b1c1-0001-4000-8000-000000000001',
      metric_type: metricType,
      value: val,
      unit: conf.unit,
      recorded_at: new Date(metricTime).toISOString(),
    })

    // Check if out of range
    if (val < conf.normalRange.min || val > conf.normalRange.max) {
      addNotification({
        user_id: 'd1a1b1c1-0002-4000-8000-000000000002',
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
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Swasthya Vitals Telemetry (ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥିତି)"
        subtitle="Continuous physiological monitoring, ICMR threshold curves, and cardiologist review guidelines."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Naya Vitals Record Karein
          </button>
        }
      />

      {/* Vital Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Blood Pressure */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-[#DC2626]" /> Raktachaap (Blood Pressure)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                ICMR Normal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1917] font-serif">
                {latestSys ? latestSys.value : 124} / {latestDia ? latestDia.value : 82}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">mmHg</span>
            </div>
            <p className="text-xs text-[#57534E] mt-2">Target Clinician Range: 90-140 / 60-90 mmHg</p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] mt-3 text-[11px] text-[#A8A29E]">
            Recorded: {latestSys ? formatDate(latestSys.recorded_at) : 'Today'}
          </div>
        </div>

        {/* Heart Rate */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-[#C2410C]" /> Hridaya Gati (Pulse / Heart Rate)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                Normal Rhythm
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1917] font-serif">
                {latestHR ? latestHR.value : 74}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">bpm</span>
            </div>
            <p className="text-xs text-[#57534E] mt-2">Target Clinician Range: 60 - 100 bpm</p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] mt-3 text-[11px] text-[#A8A29E]">
            Recorded: {latestHR ? formatDate(latestHR.recorded_at) : 'Today'}
          </div>
        </div>

        {/* SpO2 */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-[#0F766E]" /> Oxygen Saturation (SpO2)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59]">
                Optimal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1917] font-serif">
                {latestSpO2 ? latestSpO2.value : 98}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">%</span>
            </div>
            <p className="text-xs text-[#57534E] mt-2">Target Clinician Range: 95 - 100%</p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] mt-3 text-[11px] text-[#A8A29E]">
            Recorded: {latestSpO2 ? formatDate(latestSpO2.recorded_at) : 'Today'}
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-[#D97706]" /> Rakt Sarkara (Blood Glucose)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                Fasting Normal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1917] font-serif">
                {latestSugar ? latestSugar.value : 112}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">mg/dL</span>
            </div>
            <p className="text-xs text-[#57534E] mt-2">Target Clinician Range: 70 - 140 mg/dL</p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] mt-3 text-[11px] text-[#A8A29E]">
            Recorded: {latestSugar ? formatDate(latestSugar.recorded_at) : 'Yesterday'}
          </div>
        </div>

        {/* Temperature */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-[#EA580C]" /> Body Temperature
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                Normal Temp
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1C1917] font-serif">
                {latestTemp ? latestTemp.value.toFixed(1) : '98.4'}
              </span>
              <span className="text-xs text-[#78716C] font-semibold">°F</span>
            </div>
            <p className="text-xs text-[#57534E] mt-2">Target Clinician Range: 97.0 - 99.5 °F</p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] mt-3 text-[11px] text-[#A8A29E]">
            Recorded: {latestTemp ? formatDate(latestTemp.recorded_at) : '2 days ago'}
          </div>
        </div>

        {/* Clinical Note Card */}
        <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF7ED] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#9A3412] font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-[#EA580C]" />
              Dr. Anil Sharma's Clinical Nirdesh
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              "Maintain morning blood pressure recordings within 30 minutes of waking and prior to breakfast. Notify clinic immediately if systolic exceeds 160 mmHg on two consecutive tests."
            </p>
          </div>
          <div className="text-[11px] font-bold text-[#C2410C] pt-3 border-t border-[#FED7AA]/60">
            Last Clinical Review: Nov 14, 2026
          </div>
        </div>
      </div>

      {/* Dynamic Visual Trend Chart with Recharts Styled in Indian Warm Claude Tones */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#C2410C]" />
              10-Day Physiological Trajectory (ସ୍ୱାସ୍ଥ୍ୟ ଗତିବିଧି)
            </h3>
            <p className="text-xs text-[#78716C]">Historical telemetry plotted against safety thresholds</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#EAE3D8]">
            <button
              onClick={() => setSelectedTab('bp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'bp' ? 'bg-[#1C1917] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setSelectedTab('heart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'heart' ? 'bg-[#1C1917] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Heart Rate
            </button>
            <button
              onClick={() => setSelectedTab('spo2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'spo2' ? 'bg-[#1C1917] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              SpO2 Oxygen
            </button>
            <button
              onClick={() => setSelectedTab('glucose')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTab === 'glucose' ? 'bg-[#1C1917] text-white shadow-2xs' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              Glucose
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F1EB" />
              <XAxis dataKey="date" stroke="#A8A29E" fontSize={12} tickLine={false} />
              <YAxis stroke="#A8A29E" fontSize={12} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EAE3D8',
                  boxShadow: '0 4px 6px -1px rgba(41, 37, 36, 0.05)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />

              {selectedTab === 'bp' && (
                <>
                  <ReferenceLine y={140} label="Max Systolic Threshold (140)" stroke="#DC2626" strokeDasharray="3 3" />
                  <ReferenceLine y={90} label="Min Systolic" stroke="#0F766E" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="systolic" stroke="#C2410C" strokeWidth={3} name="Systolic (mmHg)" dot={{ r: 4, fill: '#C2410C' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="#F59E0B" strokeWidth={3} name="Diastolic (mmHg)" dot={{ r: 4, fill: '#F59E0B' }} />
                </>
              )}

              {selectedTab === 'heart' && (
                <>
                  <ReferenceLine y={100} label="Max Normal (100)" stroke="#DC2626" strokeDasharray="3 3" />
                  <ReferenceLine y={60} label="Min Normal (60)" stroke="#0F766E" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="heartRate" stroke="#EA580C" strokeWidth={3} name="Heart Rate (bpm)" dot={{ r: 4 }} />
                </>
              )}

              {selectedTab === 'spo2' && (
                <>
                  <ReferenceLine y={95} label="Hypoxia Threshold (95%)" stroke="#DC2626" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="spo2" stroke="#0F766E" strokeWidth={3} name="Oxygen Saturation (%)" dot={{ r: 4 }} />
                </>
              )}

              {selectedTab === 'glucose' && (
                <>
                  <ReferenceLine y={140} label="Post-Meal Upper Bound (140)" stroke="#D97706" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="glucose" stroke="#7C3AED" strokeWidth={3} name="Blood Glucose (mg/dL)" dot={{ r: 4 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal to log reading */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Vitals Reading (ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଲଗ୍)" size="md">
        <form onSubmit={handleRecordReading} className="space-y-4">
          <Select
            label="Metric Type (କେଉଁ ମାପ?)"
            value={metricType}
            onChange={e => setMetricType(e.target.value as MetricType)}
            options={[
              { value: 'blood_pressure_systolic', label: 'Blood Pressure — Systolic (mmHg)' },
              { value: 'blood_pressure_diastolic', label: 'Blood Pressure — Diastolic (mmHg)' },
              { value: 'heart_rate', label: 'Pulse / Heart Rate (bpm)' },
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
              className="px-4 py-2.5 rounded-xl border border-[#EAE3D8] text-[#57534E] font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Save Vital Reading
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
