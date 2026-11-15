import { useState } from 'react'
import {
  Bell, Clock, AlertTriangle, Pill,
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
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Suchnaayein & Escalation Inbox (ସୂଚନା କେନ୍ଦ୍ର)"
        subtitle="Medication reminders, threshold warnings, missed dose alerts, and system telemetry."
      />

      <div className="flex gap-2 border-b border-[#EAE3D8] pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-[#57534E] hover:bg-[#F5F1EB]'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-[#57534E] hover:bg-[#F5F1EB]'
          }`}
        >
          Unread ({notifications.filter(n => !n.read_at).length})
        </button>
      </div>

      <div className="rounded-3xl border border-[#EAE3D8] bg-white overflow-hidden shadow-xs divide-y divide-[#EAE3D8]">
        {filteredNotifs.length === 0 ? (
          <p className="text-center py-12 text-xs text-[#78716C]">No notifications found. All clear!</p>
        ) : (
          filteredNotifs.map(notif => {
            const isUnread = !notif.read_at

            const iconMap = {
              medication_reminder: <Pill className="h-5 w-5 text-[#C2410C]" />,
              missed_dose: <AlertTriangle className="h-5 w-5 text-[#DC2626]" />,
              health_alert: <HeartPulse className="h-5 w-5 text-[#0F766E]" />,
              emergency: <ShieldAlert className="h-5 w-5 text-[#DC2626]" />,
              care_task: <Clock className="h-5 w-5 text-[#D97706]" />,
              system: <Bell className="h-5 w-5 text-[#78716C]" />,
              appointment: <Clock className="h-5 w-5 text-[#059669]" />,
            }

            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  isUnread ? 'bg-[#FFF7ED]/50' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] shrink-0 mt-0.5">
                    {iconMap[notif.type] || <Bell className="h-5 w-5 text-[#78716C]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1C1917]">{notif.title}</h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-[#C2410C] shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-[#57534E] mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-[#A8A29E] mt-1.5 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      · {formatDate(notif.created_at)}
                    </p>
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2 rounded-xl text-[#78716C] hover:text-[#C2410C] hover:bg-[#FFEDD5] text-xs font-semibold shrink-0 cursor-pointer"
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
