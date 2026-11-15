import { Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, Users, Check, ArrowRight
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function CaregiverDashboard() {
  const {
    currentUser,
    careTasks,
    updateTaskStatus,
    getPatientProfiles,
  } = useApp()

  const patients = getPatientProfiles()
  const pendingTasks = careTasks.filter(t => t.status === 'pending' || t.status === 'overdue')
  const completedTasks = careTasks.filter(t => t.status === 'completed')

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title={`Seva Attendant Dashboard — ${currentUser?.full_name || 'Sunita Devi'}`}
        subtitle="Daily care schedule, vital recording duties, and elder assistance checklist (ଦୈନିକ ସେବା ତାଲିକା)."
        action={
          <Link
            to="/caregiver/tasks"
            className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            Manage All Seva Tasks
          </Link>
        }
      />

      {/* Top 3 Task Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Pending Seva Duties</p>
            <p className="text-2xl font-black text-[#D97706] mt-1 font-serif">{pendingTasks.length}</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Tasks awaiting checkoff</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Completed Today</p>
            <p className="text-2xl font-black text-[#059669] mt-1 font-serif">{completedTasks.length}</p>
            <p className="text-[11px] text-[#059669] font-semibold mt-0.5">Successfully logged</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Assigned Elder</p>
            <p className="text-2xl font-black text-[#1C1917] mt-1 font-serif">Ramesh Ji</p>
            <p className="text-[11px] text-[#78716C] mt-0.5">Bhubaneswar Home</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#FFEDD5] text-[#9A3412] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Checklist & Patient Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D8] pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#1C1917] font-serif flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                Shift Supervision Checklist (ସେବା ଯାଞ୍ଚ ସୂଚୀ)
              </h3>
              <p className="text-xs text-[#78716C]">Tap to mark completed as you assist Ramesh Ji</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
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
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-[#FAF8F5] border-[#EAE3D8] opacity-75'
                      : isOverdue
                      ? 'bg-[#FEF2F2] border-[#FECACA]'
                      : 'bg-white border-[#EAE3D8] hover:border-[#A7F3D0]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => updateTaskStatus(task.id, isDone ? 'pending' : 'completed')}
                      className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-[#059669] border-[#059669] text-white'
                          : 'border-[#DDD3C3] hover:border-[#059669] bg-white'
                      }`}
                    >
                      {isDone && <Check className="h-4 w-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${isDone ? 'line-through text-[#A8A29E]' : 'text-[#1C1917]'}`}>
                          {task.title}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          task.priority === 'high' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                          task.priority === 'medium' ? 'bg-[#FEF3C7] text-[#B45309]' :
                          'bg-[#F5F1EB] text-[#78716C]'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] mt-0.5">{task.description}</p>
                      <p className="text-[11px] text-[#A8A29E] mt-1">Due: {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isDone ? (
                      <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer"
                      >
                        Complete Task ✓
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
          <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
            <h4 className="text-base font-bold text-[#1C1917] font-serif mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#C2410C]" />
              Assigned Elder
            </h4>

            <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#EA580C] text-white font-black text-lg flex items-center justify-center font-serif">
                  RK
                </div>
                <div>
                  <h5 className="font-bold text-[#1C1917] text-sm font-serif">Ramesh Kumar Ji</h5>
                  <p className="text-xs text-[#78716C]">Age 72 · Bhubaneswar, Odisha</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#57534E] pt-2 border-t border-[#FED7AA]/60">
                <div className="flex justify-between">
                  <span>Prescriptions:</span>
                  <span className="font-bold text-[#1C1917]">4 Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Status:</span>
                  <span className="font-bold text-[#059669]">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Family Contact:</span>
                  <span className="font-bold text-[#1C1917]">Priya (Daughter)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/family/patient/patient-001"
                  className="w-full py-2.5 rounded-xl bg-white text-[#9A3412] border border-[#FED7AA] hover:bg-[#FFEDD5] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
