import { Link } from 'react-router-dom'
import {
  Award, CheckCircle2, Clock, AlertTriangle, Users,
  Pill, Activity, ArrowRight, Check, AlertCircle
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function CaregiverDashboard() {
  const {
    currentUser,
    careTasks,
    updateTaskStatus,
    emergencyEvents,
    medications,
    getPatientProfiles,
  } = useApp()

  const patients = getPatientProfiles()
  const pendingTasks = careTasks.filter(t => t.status === 'pending' || t.status === 'overdue')
  const completedTasks = careTasks.filter(t => t.status === 'completed')
  const openAlerts = emergencyEvents.filter(e => e.status === 'open')

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Caregiver Dashboard — ${currentUser?.full_name || 'Sunita Devi'}`}
        subtitle="Daily care schedule, vital recording duties, and patient supervision checklist."
        action={
          <Link
            to="/caregiver/tasks"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            Manage All Tasks
          </Link>
        }
      />

      {/* Top 3 Task Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Pending Daily Duties"
          value={pendingTasks.length}
          subtitle="Tasks awaiting checkoff"
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Completed Today"
          value={completedTasks.length}
          subtitle="Successfully logged"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Assigned Patients"
          value={patients.length}
          subtitle="Mr. Ramesh Kumar"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* Main Grid: Today's Checklist & Patient Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Shift Supervision Checklist
              </h3>
              <p className="text-xs text-slate-500">Tap to complete tasks as you assist Mr. Ramesh</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {completedTasks.length} of {careTasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {careTasks.map(task => {
              const isDone = task.status === 'completed'
              const isOverdue = task.status === 'overdue'

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : isOverdue
                      ? 'bg-red-50/60 border-red-300'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => updateTaskStatus(task.id, isDone ? 'pending' : 'completed')}
                      className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-emerald-500 bg-white'
                      }`}
                    >
                      {isDone && <Check className="h-4 w-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Due: {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isDone ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Complete Task
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Assigned Patient Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Assigned
            </h4>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                  RK
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Ramesh Kumar</h5>
                  <p className="text-xs text-slate-500">Age 72 · Bhubaneswar, Odisha</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-blue-200/60">
                <div className="flex justify-between">
                  <span>Prescriptions:</span>
                  <span className="font-bold text-slate-900">4 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Status:</span>
                  <span className="font-bold text-emerald-600">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Family Contact:</span>
                  <span className="font-bold text-slate-900">Priya (Daughter)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/family/patient/patient-001"
                  className="w-full py-2 rounded-xl bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  Open Complete Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
