import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {
  User, UserRole, Medication, MedicationLog, MedicationSchedule,
  HealthReading, EmergencyEvent, AppNotification, CareTask,
  SimulationEvent, CareIntelligenceScore, DoseStatus,
} from '@/types'
import {
  DEMO_USERS, DEMO_MEDICATIONS, DEMO_MEDICATION_LOGS, DEMO_SCHEDULES,
  DEMO_HEALTH_READINGS, DEMO_EMERGENCY_EVENTS, DEMO_NOTIFICATIONS,
  DEMO_CARE_TASKS, DEMO_AI_INSIGHTS, DEMO_PATIENT_PROFILES,
  DEMO_CARE_RELATIONSHIPS, DEMO_EMERGENCY_CONTACTS, DEMO_APPOINTMENTS,
} from '@/data/mock-data'
import { generateId, calculateAdherence } from '@/lib/utils'

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
}

interface AppContextType extends AppState {
  // Auth
  login: (role: UserRole) => void
  logout: () => void

  // Medications
  addMedication: (med: Omit<Medication, 'id' | 'created_at'>) => void
  updateMedicationLog: (logId: string, status: DoseStatus) => void
  deleteMedication: (id: string) => void

  // Health
  addHealthReading: (reading: Omit<HealthReading, 'id'>) => void

  // Emergency
  triggerSOS: (description?: string) => void
  triggerFallDetection: () => void
  resolveEmergency: (eventId: string) => void
  acknowledgeEmergency: (eventId: string) => void

  // Notifications
  markNotificationRead: (id: string) => void
  addNotification: (notif: Omit<AppNotification, 'id' | 'created_at'>) => void

  // Care Tasks
  updateTaskStatus: (taskId: string, status: CareTask['status']) => void

  // Simulation
  triggerSimulation: (event: Omit<SimulationEvent, 'id' | 'timestamp' | 'processed'>) => void
  clearSimulationEvents: () => void

  // Computed
  getCareIntelligenceScore: () => CareIntelligenceScore
  getAdherenceRate: () => number
  getTodaysMedications: () => MedicationLog[]
  getUnreadNotificationCount: () => number
  getPatientProfiles: () => typeof DEMO_PATIENT_PROFILES
  getCareRelationships: () => typeof DEMO_CARE_RELATIONSHIPS
  getEmergencyContacts: () => typeof DEMO_EMERGENCY_CONTACTS
  getAppointments: () => typeof DEMO_APPOINTMENTS
  getAIInsights: () => typeof DEMO_AI_INSIGHTS
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [medications, setMedications] = useState<Medication[]>(DEMO_MEDICATIONS)
  const [schedules] = useState<MedicationSchedule[]>(DEMO_SCHEDULES)
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(DEMO_MEDICATION_LOGS)
  const [healthReadings, setHealthReadings] = useState<HealthReading[]>(DEMO_HEALTH_READINGS)
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(DEMO_EMERGENCY_EVENTS)
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS)
  const [careTasks, setCareTasks] = useState<CareTask[]>(DEMO_CARE_TASKS)
  const [simulationEvents, setSimulationEvents] = useState<SimulationEvent[]>([])

  // === Auth ===
  const login = useCallback((role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role)
    if (user) setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // === Medications ===
  const addMedication = useCallback((med: Omit<Medication, 'id' | 'created_at'>) => {
    const newMed: Medication = {
      ...med,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    setMedications(prev => [...prev, newMed])
    addNotification({
      user_id: 'user-patient-001',
      title: 'New Medication Added',
      message: `${med.medicine_name} ${med.dosage} has been added to your schedule.`,
      type: 'system',
    })
  }, [])

  const updateMedicationLog = useCallback((logId: string, status: DoseStatus) => {
    setMedicationLogs(prev =>
      prev.map(log =>
        log.id === logId
          ? { ...log, status, recorded_at: new Date().toISOString() }
          : log
      )
    )

    if (status === 'missed') {
      addNotification({
        user_id: 'user-family-001',
        title: 'Missed Dose Alert',
        message: 'A scheduled medication dose was missed. Please check on the patient.',
        type: 'missed_dose',
      })
    }
  }, [])

  const deleteMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id))
  }, [])

  // === Health ===
  const addHealthReading = useCallback((reading: Omit<HealthReading, 'id'>) => {
    const newReading: HealthReading = {
      ...reading,
      id: generateId(),
    }
    setHealthReadings(prev => [...prev, newReading])
  }, [])

  // === Emergency ===
  const triggerSOS = useCallback((description?: string) => {
    const event: EmergencyEvent = {
      id: generateId(),
      patient_id: 'patient-001',
      event_type: 'sos',
      status: 'open',
      severity: 'critical',
      description: description || 'SOS activated by patient',
      created_at: new Date().toISOString(),
    }
    setEmergencyEvents(prev => [event, ...prev])
    addNotification({
      user_id: 'user-family-001',
      title: '🚨 Emergency SOS',
      message: 'Ramesh Kumar has activated the emergency SOS button!',
      type: 'emergency',
    })
    addNotification({
      user_id: 'user-caregiver-001',
      title: '🚨 Emergency SOS',
      message: 'Ramesh Kumar has activated the emergency SOS button!',
      type: 'emergency',
    })
  }, [])

  const triggerFallDetection = useCallback(() => {
    const event: EmergencyEvent = {
      id: generateId(),
      patient_id: 'patient-001',
      event_type: 'fall_detected',
      status: 'open',
      severity: 'high',
      description: 'Simulated fall detected — awaiting patient confirmation',
      created_at: new Date().toISOString(),
    }
    setEmergencyEvents(prev => [event, ...prev])
    addNotification({
      user_id: 'user-family-001',
      title: '⚠️ Fall Detected',
      message: 'A potential fall has been detected for Ramesh Kumar. Awaiting confirmation.',
      type: 'emergency',
    })
  }, [])

  const resolveEmergency = useCallback((eventId: string) => {
    setEmergencyEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, status: 'resolved' as const, resolved_at: new Date().toISOString() }
          : e
      )
    )
  }, [])

  const acknowledgeEmergency = useCallback((eventId: string) => {
    setEmergencyEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? { ...e, status: 'acknowledged' as const, acknowledged_by: currentUser?.id }
          : e
      )
    )
  }, [currentUser])

  // === Notifications ===
  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'created_at'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    setNotifications(prev => [newNotif, ...prev])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      )
    )
  }, [])

  // === Care Tasks ===
  const updateTaskStatus = useCallback((taskId: string, status: CareTask['status']) => {
    setCareTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status, completed_at: status === 'completed' ? new Date().toISOString() : undefined }
          : t
      )
    )
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

    // Process simulation effect
    switch (event.type) {
      case 'missed_medication':
        updateMedicationLog(
          medicationLogs.find(l => l.status === 'upcoming')?.id || '',
          'missed'
        )
        break
      case 'fall_detected':
        triggerFallDetection()
        break
      case 'emergency_sos':
        triggerSOS('Simulated SOS from demo control panel')
        break
      case 'abnormal_reading':
        addHealthReading({
          patient_id: 'patient-001',
          metric_type: 'blood_pressure_systolic',
          value: 165,
          unit: 'mmHg',
          recorded_at: new Date().toISOString(),
        })
        addNotification({
          user_id: 'user-patient-001',
          title: '⚠️ Abnormal Reading',
          message: 'Blood pressure systolic reading of 165 mmHg is above the configured threshold (140 mmHg).',
          type: 'health_alert',
        })
        break
      case 'low_stock':
        setMedications(prev =>
          prev.map(m =>
            m.id === 'med-004' ? { ...m, stock_count: 2 } : m
          )
        )
        addNotification({
          user_id: 'user-patient-001',
          title: '💊 Low Medicine Stock',
          message: 'Calcium + Vitamin D3 has only 2 tablets remaining!',
          type: 'system',
        })
        break
      case 'overdue_task':
        setCareTasks(prev =>
          prev.map(t =>
            t.status === 'pending' ? { ...t, status: 'overdue' as const } : t
          )
        )
        addNotification({
          user_id: 'user-caregiver-001',
          title: '📋 Overdue Task',
          message: 'A care task is now overdue. Please check your task list.',
          type: 'care_task',
        })
        break
    }

    setSimulationEvents(prev =>
      prev.map(s => s.id === simEvent.id ? { ...s, processed: true } : s)
    )
  }, [medicationLogs, addHealthReading, addNotification, triggerFallDetection, triggerSOS, updateMedicationLog])

  const clearSimulationEvents = useCallback(() => {
    setSimulationEvents([])
  }, [])

  // === Computed Values ===
  const getAdherenceRate = useCallback(() => {
    const completedLogs = medicationLogs.filter(l => l.status !== 'upcoming')
    const taken = completedLogs.filter(l => l.status === 'taken' || l.status === 'late').length
    return calculateAdherence(taken, completedLogs.length)
  }, [medicationLogs])

  const getTodaysMedications = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return medicationLogs.filter(l => l.scheduled_at.startsWith(today))
  }, [medicationLogs])

  const getUnreadNotificationCount = useCallback(() => {
    if (!currentUser) return 0
    return notifications.filter(n => n.user_id === currentUser.id && !n.read_at).length
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

  const getPatientProfiles = useCallback(() => DEMO_PATIENT_PROFILES, [])
  const getCareRelationships = useCallback(() => DEMO_CARE_RELATIONSHIPS, [])
  const getEmergencyContacts = useCallback(() => DEMO_EMERGENCY_CONTACTS, [])
  const getAppointments = useCallback(() => DEMO_APPOINTMENTS, [])
  const getAIInsights = useCallback(() => DEMO_AI_INSIGHTS, [])

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
    login,
    logout,
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
