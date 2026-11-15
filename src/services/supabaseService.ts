import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type {
  User, PatientProfile, Medication, MedicationSchedule, MedicationLog,
  HealthReading, EmergencyEvent, EmergencyContact, AppNotification,
  CareTask, CareRelationship, Appointment, AIInsight, DoseStatus
} from '@/types'
import {
  DEMO_USERS, DEMO_PATIENT_PROFILES, DEMO_CARE_RELATIONSHIPS,
  DEMO_MEDICATIONS, DEMO_SCHEDULES, DEMO_MEDICATION_LOGS,
  DEMO_HEALTH_READINGS, DEMO_EMERGENCY_CONTACTS, DEMO_EMERGENCY_EVENTS,
  DEMO_NOTIFICATIONS, DEMO_CARE_TASKS, DEMO_APPOINTMENTS, DEMO_AI_INSIGHTS
} from '@/data/mock-data'

export interface SupabaseSyncState {
  isLive: boolean
  lastSyncedAt: Date | null
  syncError: string | null
}

// ============================================================================
// DATA FETCHERS (Live Supabase with fallback to mock data on network error)
// ============================================================================

export async function fetchUsersFromSupabase(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: true })
    if (error || !data || data.length === 0) return DEMO_USERS
    return data as User[]
  } catch (err) {
    console.warn('Supabase users query fallback:', err)
    return DEMO_USERS
  }
}

export async function fetchPatientProfilesFromSupabase(): Promise<PatientProfile[]> {
  try {
    const { data, error } = await supabase.from('patient_profiles').select('*')
    if (error || !data || data.length === 0) return DEMO_PATIENT_PROFILES
    return data.map(p => ({
      ...p,
      user: DEMO_USERS.find(u => u.id === p.user_id) || DEMO_USERS[0]
    })) as PatientProfile[]
  } catch (err) {
    return DEMO_PATIENT_PROFILES
  }
}

export async function fetchCareRelationshipsFromSupabase(): Promise<CareRelationship[]> {
  try {
    const { data, error } = await supabase.from('care_relationships').select('*')
    if (error || !data || data.length === 0) return DEMO_CARE_RELATIONSHIPS
    return data.map(r => ({
      ...r,
      user: DEMO_USERS.find(u => u.id === r.user_id)
    })) as CareRelationship[]
  } catch (err) {
    return DEMO_CARE_RELATIONSHIPS
  }
}

export async function fetchMedicationsFromSupabase(): Promise<Medication[]> {
  try {
    const { data, error } = await supabase.from('medications').select('*').order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return DEMO_MEDICATIONS
    return data as Medication[]
  } catch (err) {
    return DEMO_MEDICATIONS
  }
}

export async function fetchSchedulesFromSupabase(): Promise<MedicationSchedule[]> {
  try {
    const { data, error } = await supabase.from('medication_schedules').select('*')
    if (error || !data || data.length === 0) return DEMO_SCHEDULES
    return data as MedicationSchedule[]
  } catch (err) {
    return DEMO_SCHEDULES
  }
}

export async function fetchMedicationLogsFromSupabase(): Promise<MedicationLog[]> {
  try {
    const { data, error } = await supabase.from('medication_logs').select('*').order('scheduled_at', { ascending: false })
    if (error || !data || data.length === 0) return DEMO_MEDICATION_LOGS
    return data as MedicationLog[]
  } catch (err) {
    return DEMO_MEDICATION_LOGS
  }
}

export async function fetchHealthReadingsFromSupabase(): Promise<HealthReading[]> {
  try {
    const { data, error } = await supabase.from('health_readings').select('*').order('recorded_at', { ascending: true })
    if (error || !data || data.length === 0) return DEMO_HEALTH_READINGS
    return data as HealthReading[]
  } catch (err) {
    return DEMO_HEALTH_READINGS
  }
}

export async function fetchEmergencyEventsFromSupabase(): Promise<EmergencyEvent[]> {
  try {
    const { data, error } = await supabase.from('emergency_events').select('*').order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return DEMO_EMERGENCY_EVENTS
    return data as EmergencyEvent[]
  } catch (err) {
    return DEMO_EMERGENCY_EVENTS
  }
}

export async function fetchEmergencyContactsFromSupabase(): Promise<EmergencyContact[]> {
  try {
    const { data, error } = await supabase.from('emergency_contacts').select('*').order('priority', { ascending: true })
    if (error || !data || data.length === 0) return DEMO_EMERGENCY_CONTACTS
    return data as EmergencyContact[]
  } catch (err) {
    return DEMO_EMERGENCY_CONTACTS
  }
}

export async function fetchCareTasksFromSupabase(): Promise<CareTask[]> {
  try {
    const { data, error } = await supabase.from('care_tasks').select('*').order('due_at', { ascending: true })
    if (error || !data || data.length === 0) return DEMO_CARE_TASKS
    return data as CareTask[]
  } catch (err) {
    return DEMO_CARE_TASKS
  }
}

export async function fetchNotificationsFromSupabase(): Promise<AppNotification[]> {
  try {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return DEMO_NOTIFICATIONS
    return data as AppNotification[]
  } catch (err) {
    return DEMO_NOTIFICATIONS
  }
}

export async function fetchAIInsightsFromSupabase(): Promise<AIInsight[]> {
  try {
    const { data, error } = await supabase.from('ai_insights').select('*').order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return DEMO_AI_INSIGHTS
    return data as AIInsight[]
  } catch (err) {
    return DEMO_AI_INSIGHTS
  }
}

export async function fetchAppointmentsFromSupabase(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase.from('appointments').select('*').order('appointment_at', { ascending: true })
    if (error || !data || data.length === 0) return DEMO_APPOINTMENTS
    return data as Appointment[]
  } catch (err) {
    return DEMO_APPOINTMENTS
  }
}

// ============================================================================
// MUTATIONS (Direct Supabase Database Writes)
// ============================================================================

export async function insertMedicationIntoSupabase(med: Omit<Medication, 'id' | 'created_at'>): Promise<Medication | null> {
  try {
    const { data, error } = await supabase.from('medications').insert([med]).select().single()
    if (error) {
      console.warn('Supabase insert medication error:', error.message)
      return null
    }
    return data as Medication
  } catch (err) {
    console.error('Supabase insertMedication failed:', err)
    return null
  }
}

export async function deleteMedicationFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('medications').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function updateMedicationLogStatusInSupabase(id: string, status: DoseStatus): Promise<boolean> {
  try {
    const { error } = await supabase.from('medication_logs').update({
      status,
      recorded_at: new Date().toISOString()
    }).eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function insertHealthReadingIntoSupabase(reading: Omit<HealthReading, 'id'>): Promise<HealthReading | null> {
  try {
    const { data, error } = await supabase.from('health_readings').insert([reading]).select().single()
    if (error) return null
    return data as HealthReading
  } catch {
    return null
  }
}

export async function insertEmergencyEventIntoSupabase(event: Omit<EmergencyEvent, 'id' | 'created_at'>): Promise<EmergencyEvent | null> {
  try {
    const { data, error } = await supabase.from('emergency_events').insert([event]).select().single()
    if (error) return null
    return data as EmergencyEvent
  } catch {
    return null
  }
}

export async function updateEmergencyEventInSupabase(id: string, updates: Partial<EmergencyEvent>): Promise<boolean> {
  try {
    const { error } = await supabase.from('emergency_events').update(updates).eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function insertNotificationIntoSupabase(notif: Omit<AppNotification, 'id' | 'created_at'>): Promise<AppNotification | null> {
  try {
    const { data, error } = await supabase.from('notifications').insert([notif]).select().single()
    if (error) return null
    return data as AppNotification
  } catch {
    return null
  }
}

export async function markNotificationReadInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
    return !error
  } catch {
    return false
  }
}

export async function updateCareTaskInSupabase(id: string, updates: Partial<CareTask>): Promise<boolean> {
  try {
    const { error } = await supabase.from('care_tasks').update(updates).eq('id', id)
    return !error
  } catch {
    return false
  }
}

// ============================================================================
// REALTIME SUBSCRIPTION HUB
// ============================================================================

export function subscribeToSupabaseRealtime(onTableChange: (table: string, payload: any) => void) {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase
    .channel('eldercare-360-live-telemetry')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, payload => {
      onTableChange('medications', payload)
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'medication_logs' }, payload => {
      onTableChange('medication_logs', payload)
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'health_readings' }, payload => {
      onTableChange('health_readings', payload)
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_events' }, payload => {
      onTableChange('emergency_events', payload)
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'care_tasks' }, payload => {
      onTableChange('care_tasks', payload)
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
      onTableChange('notifications', payload)
    })
    .subscribe(status => {
      console.log('⚡ Supabase Realtime Telemetry Status:', status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}
