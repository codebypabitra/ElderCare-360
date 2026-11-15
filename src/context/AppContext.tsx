import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type {
  User, UserRole, Medication, MedicationLog, MedicationSchedule,
  HealthReading, EmergencyEvent, AppNotification, CareTask,
  SimulationEvent, CareIntelligenceScore, DoseStatus, PatientProfile,
  CareRelationship, EmergencyContact, Appointment, AIInsight
} from '@/types'
import {
  DEMO_USERS, DEMO_MEDICATIONS, DEMO_MEDICATION_LOGS, DEMO_SCHEDULES,
  DEMO_HEALTH_READINGS, DEMO_EMERGENCY_EVENTS, DEMO_NOTIFICATIONS,
  DEMO_CARE_TASKS, DEMO_AI_INSIGHTS, DEMO_PATIENT_PROFILES,
  DEMO_CARE_RELATIONSHIPS, DEMO_EMERGENCY_CONTACTS, DEMO_APPOINTMENTS,
} from '@/data/mock-data'
import { generateId, calculateAdherence } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabase'
import {
  fetchUsersFromSupabase,
  fetchMedicationsFromSupabase,
  fetchSchedulesFromSupabase,
  fetchMedicationLogsFromSupabase,
  fetchHealthReadingsFromSupabase,
  fetchEmergencyEventsFromSupabase,
  fetchNotificationsFromSupabase,
  fetchCareTasksFromSupabase,
  fetchAIInsightsFromSupabase,
  fetchAppointmentsFromSupabase,
  fetchEmergencyContactsFromSupabase,
  fetchPatientProfilesFromSupabase,
  fetchCareRelationshipsFromSupabase,
  insertMedicationIntoSupabase,
  deleteMedicationFromSupabase,
  updateMedicationLogStatusInSupabase,
  insertHealthReadingIntoSupabase,
  insertEmergencyEventIntoSupabase,
  updateEmergencyEventInSupabase,
  insertNotificationIntoSupabase,
  markNotificationReadInSupabase,
  updateCareTaskInSupabase,
  subscribeToSupabaseRealtime,
} from '@/services/supabaseService'

interface AppState {
  currentUser: User | null
  medications: Medication[]
  schedules: MedicationSchedule[]
  medicationLogs: MedicationLog[]
  healthReadings: HealthReading[]
  emergencyEvents: EmergencyEvent[]
  notifications: AppNotification[]
  careTasks: CareTask[]
  simulationEvents: SimulationEvent[]
  patientProfiles: PatientProfile[]
  careRelationships: CareRelationship[]
  emergencyContacts: EmergencyContact[]
  appointments: Appointment[]
  aiInsights: AIInsight[]
  isLiveSupabase: boolean
  isSyncing: boolean
  lastSyncedAt: Date | null
}

interface AppContextType extends AppState {
  // Auth
  login: (role: UserRole) => void
  logout: () => void

  // Sync
  refreshFromSupabase: () => Promise<void>

  // Medications
  addMedication: (med: Omit<Medication, 'id' | 'created_at'>) => Promise<void>
  updateMedicationLog: (logId: string, status: DoseStatus) => Promise<void>
  deleteMedication: (id: string) => Promise<void>

  // Health
  addHealthReading: (reading: Omit<HealthReading, 'id'>) => Promise<void>

  // Emergency
  triggerSOS: (description?: string) => Promise<void>
  triggerFallDetection: () => Promise<void>
  resolveEmergency: (eventId: string) => Promise<void>
  acknowledgeEmergency: (eventId: string) => Promise<void>

  // Notifications
  markNotificationRead: (id: string) => Promise<void>
  addNotification: (notif: Omit<AppNotification, 'id' | 'created_at'>) => Promise<void>

  // Care Tasks
  updateTaskStatus: (taskId: string, status: CareTask['status']) => Promise<void>

  // Simulation
  triggerSimulation: (event: Omit<SimulationEvent, 'id' | 'timestamp' | 'processed'>) => void
  clearSimulationEvents: () => void

  // Computed
  getCareIntelligenceScore: () => CareIntelligenceScore
  getAdherenceRate: () => number
  getTodaysMedications: () => MedicationLog[]
  getUnreadNotificationCount: () => number
  getPatientProfiles: () => PatientProfile[]
  getCareRelationships: () => CareRelationship[]
  getEmergencyContacts: () => EmergencyContact[]
  getAppointments: () => Appointment[]
  getAIInsights: () => AIInsight[]
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [usersList, setUsersList] = useState<User[]>(DEMO_USERS)
  const [medications, setMedications] = useState<Medication[]>(DEMO_MEDICATIONS)
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(DEMO_SCHEDULES)
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(DEMO_MEDICATION_LOGS)
  const [healthReadings, setHealthReadings] = useState<HealthReading[]>(DEMO_HEALTH_READINGS)
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(DEMO_EMERGENCY_EVENTS)
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS)
  const [careTasks, setCareTasks] = useState<CareTask[]>(DEMO_CARE_TASKS)
  const [patientProfiles, setPatientProfiles] = useState<PatientProfile[]>(DEMO_PATIENT_PROFILES)
  const [careRelationships, setCareRelationships] = useState<CareRelationship[]>(DEMO_CARE_RELATIONSHIPS)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(DEMO_EMERGENCY_CONTACTS)
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(DEMO_AI_INSIGHTS)
  const [simulationEvents, setSimulationEvents] = useState<SimulationEvent[]>([])

  const [isLiveSupabase] = useState<boolean>(isSupabaseConfigured())
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  // ==========================================================================
  // FETCH ALL DATA DIRECTLY FROM SUPABASE
  // ==========================================================================
  const refreshFromSupabase = useCallback(async () => {
    setIsSyncing(true)
    try {
      const [
        u, meds, scheds, logs, readings, emergencies, notifs, tasks, insights, apts, contacts, profiles, rels
      ] = await Promise.all([
        fetchUsersFromSupabase(),
        fetchMedicationsFromSupabase(),
        fetchSchedulesFromSupabase(),
        fetchMedicationLogsFromSupabase(),
        fetchHealthReadingsFromSupabase(),
        fetchEmergencyEventsFromSupabase(),
        fetchNotificationsFromSupabase(),
        fetchCareTasksFromSupabase(),
        fetchAIInsightsFromSupabase(),
        fetchAppointmentsFromSupabase(),
        fetchEmergencyContactsFromSupabase(),
        fetchPatientProfilesFromSupabase(),
        fetchCareRelationshipsFromSupabase(),
      ])

      setUsersList(u)
      setMedications(meds)
      setSchedules(scheds)
      setMedicationLogs(logs)
      setHealthReadings(readings)
      setEmergencyEvents(emergencies)
      setNotifications(notifs)
      setCareTasks(tasks)
      setAiInsights(insights)
      setAppointments(apts)
      setEmergencyContacts(contacts)
      setPatientProfiles(profiles)
      setCareRelationships(rels)
      setLastSyncedAt(new Date())
    } catch (err) {
      console.warn('Supabase initial fetch encountered error:', err)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Initial mount load
  useEffect(() => {
    refreshFromSupabase()

    // Realtime Postgres Subscription
    const unsubscribe = subscribeToSupabaseRealtime((table, payload) => {
      console.log(`⚡ Supabase Realtime [${table}] ->`, payload)
      // When changes happen remotely in Supabase, sync immediately!
      refreshFromSupabase()
    })

    return () => {
      unsubscribe()
    }
  }, [refreshFromSupabase])

  // === Auth ===
  const login = useCallback((role: UserRole) => {
    const user = usersList.find(u => u.role === role) || DEMO_USERS.find(u => u.role === role)
    if (user) setCurrentUser(user)
  }, [usersList])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // === Notifications Helper ===
  const addNotification = useCallback(async (notif: Omit<AppNotification, 'id' | 'created_at'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    // Optimistic
    setNotifications(prev => [newNotif, ...prev])
    // Supabase
    await insertNotificationIntoSupabase(newNotif)
  }, [])

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    )
    await markNotificationReadInSupabase(id)
  }, [])

  // === Medications ===
  const addMedication = useCallback(async (med: Omit<Medication, 'id' | 'created_at'>) => {
    const newMed: Medication = {
      ...med,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    // Optimistic update
    setMedications(prev => [newMed, ...prev])
    // Supabase direct write
    await insertMedicationIntoSupabase(newMed)

    addNotification({
      user_id: 'd1a1b1c1-0001-4000-8000-000000000001',
      title: 'New Medication Added (Live Supabase)',
      message: `${med.medicine_name} ${med.dosage} has been committed to database.`,
      type: 'system',
    })
  }, [addNotification])

  const updateMedicationLog = useCallback(async (logId: string, status: DoseStatus) => {
    setMedicationLogs(prev =>
      prev.map(log =>
        log.id === logId
          ? { ...log, status, recorded_at: new Date().toISOString() }
          : log
      )
    )

    // Supabase update
    await updateMedicationLogStatusInSupabase(logId, status)

    if (status === 'missed') {
      addNotification({
        user_id: 'd1a1b1c1-0002-4000-8000-000000000002',
        title: 'Missed Dose Alert',
        message: 'A scheduled medication dose was marked missed in Supabase.',
        type: 'missed_dose',
      })
    }
  }, [addNotification])

  const deleteMedication = useCallback(async (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id))
    await deleteMedicationFromSupabase(id)
  }, [])

  // === Health ===
  const addHealthReading = useCallback(async (reading: Omit<HealthReading, 'id'>) => {
    const newReading: HealthReading = {
      ...reading,
      id: generateId(),
    }
    setHealthReadings(prev => [...prev, newReading])
    await insertHealthReadingIntoSupabase(newReading)
  }, [])

  // === Emergency ===
  const triggerSOS = useCallback(async (description?: string) => {
    const event: EmergencyEvent = {
      id: generateId(),
      patient_id: 'e1a1b1c1-0001-4000-8000-000000000001',
      event_type: 'sos',
      status: 'open',
      severity: 'critical',
      description: description || 'SOS activated by patient',
      created_at: new Date().toISOString(),
    }
    setEmergencyEvents(prev => [event, ...prev])
    await insertEmergencyEventIntoSupabase(event)

    addNotification({
      user_id: 'd1a1b1c1-0002-4000-8000-000000000002',
      title: '🚨 Emergency SOS Broadcast',
      message: 'Ramesh Kumar has activated the emergency SOS button! Live alert stored in Supabase.',
      type: 'emergency',
    })
  }, [addNotification])

  const triggerFallDetection = useCallback(async () => {
    const event: EmergencyEvent = {
      id: generateId(),
      patient_id: 'e1a1b1c1-0001-4000-8000-000000000001',
      event_type: 'fall_detected',
      status: 'open',
      severity: 'high',
      description: 'Simulated fall detected — awaiting patient confirmation',
      created_at: new Date().toISOString(),
    }
    setEmergencyEvents(prev => [event, ...prev])
    await insertEmergencyEventIntoSupabase(event)

    addNotification({
      user_id: 'd1a1b1c1-0002-4000-8000-000000000002',
      title: '⚠️ Fall Detected',
      message: 'A potential fall has been detected for Ramesh Kumar and synced to Supabase.',
      type: 'emergency',
    })
  }, [addNotification])

  const resolveEmergency = useCallback(async (eventId: string) => {
    setEmergencyEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, status: 'resolved' as const, resolved_at: new Date().toISOString() }
          : e
      )
    )
    await updateEmergencyEventInSupabase(eventId, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
  }, [])

  const acknowledgeEmergency = useCallback(async (eventId: string) => {
    setEmergencyEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, status: 'acknowledged' as const, acknowledged_by: currentUser?.id }
          : e
      )
    )
    await updateEmergencyEventInSupabase(eventId, {
      status: 'acknowledged',
      acknowledged_by: currentUser?.id,
    })
  }, [currentUser])

  // === Care Tasks ===
  const updateTaskStatus = useCallback(async (taskId: string, status: CareTask['status']) => {
    const completed_at = status === 'completed' ? new Date().toISOString() : undefined
    setCareTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status, completed_at } : t
      )
    )
    await updateCareTaskInSupabase(taskId, { status, completed_at })
  }, [])

  // === Simulation ===
  const triggerSimulation = useCallback((event: Omit<SimulationEvent, 'id' | 'timestamp' | 'processed'>) => {
    const simEvent: SimulationEvent = {
      ...event,
      id: generateId(),
      timestamp: new Date().toISOString(),
      processed: false,
    }
    setSimulationEvents(prev => [simEvent, ...prev])

    switch (event.type) {
      case 'missed_medication':
        if (medicationLogs.length > 0) {
          const upcoming = medicationLogs.find(l => l.status === 'upcoming') || medicationLogs[0]
          updateMedicationLog(upcoming.id, 'missed')
        }
        break
      case 'fall_detected':
        triggerFallDetection()
        break
      case 'emergency_sos':
        triggerSOS('Simulated SOS from demo control panel synced to Supabase')
        break
      case 'abnormal_reading':
        addHealthReading({
          patient_id: 'e1a1b1c1-0001-4000-8000-000000000001',
          metric_type: 'blood_pressure_systolic',
          value: 165,
          unit: 'mmHg',
          recorded_at: new Date().toISOString(),
        })
        addNotification({
          user_id: 'd1a1b1c1-0001-4000-8000-000000000001',
          title: '⚠️ Abnormal Reading (Supabase Sync)',
          message: 'Blood pressure systolic reading of 165 mmHg is above threshold.',
          type: 'health_alert',
        })
        break
      case 'low_stock':
        setMedications(prev =>
          prev.map((m, idx) => (idx === 0 ? { ...m, stock_count: 2 } : m))
        )
        break
      case 'overdue_task':
        if (careTasks.length > 0) {
          updateTaskStatus(careTasks[0].id, 'overdue')
        }
        break
    }

    setSimulationEvents(prev =>
      prev.map(s => (s.id === simEvent.id ? { ...s, processed: true } : s))
    )
  }, [medicationLogs, careTasks, addHealthReading, addNotification, triggerFallDetection, triggerSOS, updateMedicationLog, updateTaskStatus])

  const clearSimulationEvents = useCallback(() => {
    setSimulationEvents([])
  }, [])

  // === Computed ===
  const getAdherenceRate = useCallback(() => {
    const completedLogs = medicationLogs.filter(l => l.status !== 'upcoming')
    const taken = completedLogs.filter(l => l.status === 'taken' || l.status === 'late').length
    return calculateAdherence(taken, completedLogs.length || 1)
  }, [medicationLogs])

  const getTodaysMedications = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return medicationLogs.filter(l => l.scheduled_at.startsWith(today))
  }, [medicationLogs])

  const getUnreadNotificationCount = useCallback(() => {
    if (!currentUser) return notifications.filter(n => !n.read_at).length
    return notifications.filter(n => (!n.user_id || n.user_id === currentUser.id) && !n.read_at).length
  }, [notifications, currentUser])

  const getCareIntelligenceScore = useCallback((): CareIntelligenceScore => {
    const adherence = getAdherenceRate()
    const pending = careTasks.filter(t => t.status === 'pending' || t.status === 'overdue').length
    const unresolvedAlerts = emergencyEvents.filter(e => e.status === 'open').length
    const latestReading = healthReadings.length > 0
      ? new Date(healthReadings[healthReadings.length - 1].recorded_at)
      : null
    const hoursSinceReading = latestReading
      ? (Date.now() - latestReading.getTime()) / 3600000
      : 999

    const dataFreshness: CareIntelligenceScore['dataFreshness'] =
      hoursSinceReading < 24 ? 'current' : hoursSinceReading < 72 ? 'stale' : 'outdated'

    const overall = Math.max(0, Math.min(100,
      adherence * 0.4 +
      (pending === 0 ? 100 : Math.max(0, 100 - pending * 20)) * 0.25 +
      (unresolvedAlerts === 0 ? 100 : Math.max(0, 100 - unresolvedAlerts * 30)) * 0.2 +
      (dataFreshness === 'current' ? 100 : dataFreshness === 'stale' ? 60 : 20) * 0.15
    ))

    return {
      overall: Math.round(overall),
      medicationAdherence: adherence,
      pendingTasks: pending,
      unresolvedAlerts,
      dataFreshness,
      lastUpdated: new Date().toISOString(),
    }
  }, [getAdherenceRate, careTasks, emergencyEvents, healthReadings])

  const getPatientProfiles = useCallback(() => patientProfiles, [patientProfiles])
  const getCareRelationships = useCallback(() => careRelationships, [careRelationships])
  const getEmergencyContacts = useCallback(() => emergencyContacts, [emergencyContacts])
  const getAppointments = useCallback(() => appointments, [appointments])
  const getAIInsights = useCallback(() => aiInsights, [aiInsights])

  const value: AppContextType = {
    currentUser,
    medications,
    schedules,
    medicationLogs,
    healthReadings,
    emergencyEvents,
    notifications,
    careTasks,
    simulationEvents,
    patientProfiles,
    careRelationships,
    emergencyContacts,
    appointments,
    aiInsights,
    isLiveSupabase,
    isSyncing,
    lastSyncedAt,
    login,
    logout,
    refreshFromSupabase,
    addMedication,
    updateMedicationLog,
    deleteMedication,
    addHealthReading,
    triggerSOS,
    triggerFallDetection,
    resolveEmergency,
    acknowledgeEmergency,
    markNotificationRead,
    addNotification,
    updateTaskStatus,
    triggerSimulation,
    clearSimulationEvents,
    getCareIntelligenceScore,
    getAdherenceRate,
    getTodaysMedications,
    getUnreadNotificationCount,
    getPatientProfiles,
    getCareRelationships,
    getEmergencyContacts,
    getAppointments,
    getAIInsights,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
