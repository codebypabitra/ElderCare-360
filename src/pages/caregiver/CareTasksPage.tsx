import { useState } from 'react'
import {
  Plus, Clock, Check, User
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export default function CareTasksPage() {
  const { careTasks, updateTaskStatus } = useApp()
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all')
  const [modalOpen, setModalOpen] = useState(false)

  // Local task creation
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueTime, setDueTime] = useState('18:00')

  const filteredTasks = careTasks.filter(t => {
    if (filter === 'all') return true
    return t.status === filter
  })

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Seva Task Management (ଦୈନିକ ସେବା ତାଲିକା)"
        subtitle="Schedule and supervise daily elderly duties, medicine refills, and vital monitoring appointments."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Naya Seva Task Jodein
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#EAE3D8] pb-2">
        {(['all', 'pending', 'overdue', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'text-[#57534E] hover:bg-[#F5F1EB]'
            }`}
          >
            {tab} ({careTasks.filter(t => tab === 'all' ? true : t.status === tab).length})
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map(task => {
          const isDone = task.status === 'completed'
          const isOverdue = task.status === 'overdue'

          return (
            <div
              key={task.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-[#FAF8F5] border-[#EAE3D8] opacity-80'
                  : isOverdue
                  ? 'bg-[#FEF2F2] border-[#FECACA]'
                  : 'bg-white border-[#EAE3D8] hover:border-[#A7F3D0] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      task.priority === 'high' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                      task.priority === 'medium' ? 'bg-[#FEF3C7] text-[#B45309]' :
                      'bg-[#F5F1EB] text-[#78716C]'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      isDone ? 'bg-[#DCFCE7] text-[#15803D]' :
                      isOverdue ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                      'bg-[#E0F2FE] text-[#0369A1]'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <button
                    onClick={() => updateTaskStatus(task.id, isDone ? 'pending' : 'completed')}
                    className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isDone ? 'bg-[#059669] border-[#059669] text-white' : 'border-[#DDD3C3] hover:border-[#059669] bg-white'
                    }`}
                  >
                    {isDone && <Check className="h-4 w-4" />}
                  </button>
                </div>

                <h4 className={`text-base font-bold mb-1 font-serif ${isDone ? 'line-through text-[#A8A29E]' : 'text-[#1C1917]'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-[#57534E] mb-3 leading-relaxed">{task.description}</p>
              </div>

              <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-between text-xs text-[#78716C]">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="h-3.5 w-3.5" /> Due: {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1 text-[#1C1917] font-semibold">
                  <User className="h-3.5 w-3.5 text-[#C2410C]" /> Ramesh Kumar Ji
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Seva Duty (ନୂଆ ସେବା ଦାୟିତ୍ୱ)" size="md">
        <form
          onSubmit={e => {
            e.preventDefault()
            setModalOpen(false)
          }}
          className="space-y-4"
        >
          <Input label="Task Title" placeholder="e.g. Assist with evening walk & breathing exercises" value={title} onChange={e => setTitle(e.target.value)} required />
          <Input label="Description / Nirdesh" placeholder="Specific instructions for attendant..." value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High (Escalates on Delay)' },
              ]}
            />
            <Input label="Due Time" type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} required />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-[#EAE3D8] text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#059669] text-white font-bold text-xs cursor-pointer">
              Assign Seva Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
