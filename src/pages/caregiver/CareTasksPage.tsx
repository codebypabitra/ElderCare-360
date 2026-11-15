import { useState } from 'react'
import {
  ClipboardList, Plus, CheckCircle2, Clock, AlertTriangle,
  Calendar, Trash2, Check, User
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatDate } from '@/lib/utils'
import type { TaskStatus } from '@/types'

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
    <div className="space-y-6">
      <PageHeader
        title="Care Task Management"
        subtitle="Schedule and supervise daily elderly duties, medicine refills, and vital monitoring appointments."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Create Care Task
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {(['all', 'pending', 'overdue', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
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
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : isOverdue
                  ? 'bg-red-50/60 border-red-300'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isDone ? 'bg-emerald-100 text-emerald-800' :
                      isOverdue ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <button
                    onClick={() => updateTaskStatus(task.id, isDone ? 'pending' : 'completed')}
                    className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-emerald-500 bg-white'
                    }`}
                  >
                    {isDone && <Check className="h-4 w-4" />}
                  </button>
                </div>

                <h4 className={`text-base font-bold mb-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 mb-3">{task.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Due: {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <User className="h-3.5 w-3.5" /> Ramesh Kumar
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Care Duty" size="md">
        <form
          onSubmit={e => {
            e.preventDefault()
            setModalOpen(false)
          }}
          className="space-y-4"
        >
          <Input label="Task Title" placeholder="e.g. Assist with evening walk & breathing exercises" value={title} onChange={e => setTitle(e.target.value)} required />
          <Input label="Description / Instructions" placeholder="Specific instructions for attendant..." value={desc} onChange={e => setDesc(e.target.value)} />
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
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
              Assign Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
