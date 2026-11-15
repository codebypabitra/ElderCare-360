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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3 pl-12 lg:pl-0">
            {isLiveSupabase ? (
              <button
                onClick={() => refreshFromSupabase()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Click to refresh Supabase sync"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isSyncing ? 'Syncing...' : '⚡ Supabase Live Realtime'}</span>
                <RefreshCw className={`h-3 w-3 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Database className="h-3 w-3 text-slate-500" />
                Local Telemetry
              </span>
            )}

            <Link
              to="/demo"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Demo Simulator Lab
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {activeAlerts.length > 0 && (
              <Link
                to="/patient/emergency"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold animate-bounce shadow-md shadow-red-500/30"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{activeAlerts.length} Active Emergency</span>
              </Link>
            )}

            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-2 text-right">
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-500 capitalize">{currentUser.role} View</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser.full_name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
