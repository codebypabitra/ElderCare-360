import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useApp } from '@/context/AppContext'
import { Bell, ShieldAlert, Sparkles, RefreshCw, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardLayout() {
  const {
    currentUser,
    emergencyEvents,
    getUnreadNotificationCount,
    isLiveSupabase,
    isSyncing,
    refreshFromSupabase
  } = useApp()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const activeAlerts = emergencyEvents.filter(e => e.status === 'open')
  const unreadCount = getUnreadNotificationCount()

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden text-[#1C1917]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Claude Warm Top Bar */}
        <header className="h-16 border-b border-[#EAE3D8] bg-[#FAF8F5]/90 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 pl-12 lg:pl-0">
            {isLiveSupabase ? (
              <button
                onClick={() => refreshFromSupabase()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors cursor-pointer"
                title="Click to refresh live Supabase telemetry"
              >
                <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
                <span>{isSyncing ? 'Syncing...' : '⚡ Supabase Live Realtime'}</span>
                <RefreshCw className={`h-3 w-3 text-[#047857] ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F1EB] text-[#78716C] border border-[#EAE3D8]">
                <Database className="h-3 w-3 text-[#78716C]" />
                Local Telemetry
              </span>
            )}

            <Link
              to="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#9A3412] hover:bg-[#FFEDD5] transition-colors border border-[#FED7AA]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#EA580C]" />
              Simulation Lab (Judge Hub)
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {activeAlerts.length > 0 && (
              <Link
                to="/patient/emergency"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-black animate-bounce shadow-md shadow-[#DC2626]/20"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{activeAlerts.length} Emergency Alert</span>
              </Link>
            )}

            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F1EB] transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-[#EAE3D8]"></div>

            <div className="flex items-center gap-2.5 text-right">
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#1C1917] leading-tight">{currentUser.full_name}</p>
                <p className="text-[11px] text-[#78716C] capitalize">{currentUser.role} Portal</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#FFEDD5] text-[#9A3412] font-black flex items-center justify-center text-xs border border-[#FED7AA]">
                {currentUser.full_name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
