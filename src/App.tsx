import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Lazy loaded page components
const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const PatientDashboard = lazy(() => import('@/pages/patient/PatientDashboard'))
const MedicationsPage = lazy(() => import('@/pages/patient/MedicationsPage'))
const HealthPage = lazy(() => import('@/pages/patient/HealthPage'))
const AIAssistantPage = lazy(() => import('@/pages/patient/AIAssistantPage'))
const EmergencyPage = lazy(() => import('@/pages/patient/EmergencyPage'))
const FamilyDashboard = lazy(() => import('@/pages/family/FamilyDashboard'))
const PatientCarePage = lazy(() => import('@/pages/family/PatientCarePage'))
const CaregiverDashboard = lazy(() => import('@/pages/caregiver/CaregiverDashboard'))
const CareTasksPage = lazy(() => import('@/pages/caregiver/CareTasksPage'))
const DoctorDashboard = lazy(() => import('@/pages/doctor/DoctorDashboard'))
const PrescriptionsPage = lazy(() => import('@/pages/doctor/PrescriptionsPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const SimulationLab = lazy(() => import('@/pages/SimulationLab'))

function LoadingFallback() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-bold tracking-tight">Initializing ElderCare 360 Ecosystem...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Authenticated Dashboard Shell */}
            <Route element={<DashboardLayout />}>
              {/* Patient Modules */}
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/medications" element={<MedicationsPage />} />
              <Route path="/patient/health" element={<HealthPage />} />
              <Route path="/patient/assistant" element={<AIAssistantPage />} />
              <Route path="/patient/emergency" element={<EmergencyPage />} />

              {/* Family Modules */}
              <Route path="/family/dashboard" element={<FamilyDashboard />} />
              <Route path="/family/patient/:id" element={<PatientCarePage />} />

              {/* Caregiver Modules */}
              <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
              <Route path="/caregiver/tasks" element={<CareTasksPage />} />

              {/* Doctor Modules */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/prescriptions" element={<PrescriptionsPage />} />

              {/* Common Hubs */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/demo" element={<SimulationLab />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  )
}
