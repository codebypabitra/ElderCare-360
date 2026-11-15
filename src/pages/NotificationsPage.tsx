import { useState } from 'react'
import {
  Bell, CheckCircle2, Clock, AlertTriangle, Pill,
  HeartPulse, ShieldAlert, Check
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatDate } from '@/lib/utils'

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read_at
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Escalation Inbox"
        subtitle="Medication reminders, threshold warnings, missed dose alerts, and system telemetry."
      />

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({notifications.filter(n => !n.read_at).length})
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredNotifs.length === 0 ? (
          <p className="text-center py-12 text-xs text-slate-400">No notifications found.</p>
        ) : (
          filteredNotifs.map(notif => {
            const isUnread = !notif.read_at

            const iconMap = {
              medication_reminder: <Pill className="h-5 w-5 text-blue-600" />,
              missed_dose: <AlertTriangle className="h-5 w-5 text-red-600" />,
              health_alert: <HeartPulse className="h-5 w-5 text-purple-600" />,
              emergency: <ShieldAlert className="h-5 w-5 text-rose-600" />,
              care_task: <Clock className="h-5 w-5 text-amber-600" />,
              system: <Bell className="h-5 w-5 text-slate-600" />,
              appointment: <Clock className="h-5 w-5 text-emerald-600" />,
            }

            return (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  isUnread ? 'bg-blue-50/40' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {iconMap[notif.type] || <Bell className="h-5 w-5 text-slate-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      · {formatDate(notif.created_at)}
                    </p>
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 text-xs font-semibold shrink-0"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
