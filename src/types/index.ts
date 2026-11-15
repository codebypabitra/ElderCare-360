// ========================
// User & Auth Types
// ========================
export type UserRole = 'patient' | 'family' | 'caregiver' | 'doctor' | 'admin'

export interface User {
  id: string
  full_name: string
  email: string
  role: UserRole
  phone?: string
  avatar_url?: string
  created_at: string
}

// ========================
// Patient Types
// ========================
export interface PatientProfile {
  id: string
  user_id: string
  date_of_birth?: string
  blood_group?: string
  address?: string
  emergency_status: 'normal' | 'alert' | 'emergency'
  created_at: string
  user?: User
}

// ========================
// Doctor Types
// ========================
export interface DoctorProfile {
  id: string
  user_id: string
  specialization: string
  license_number?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  user?: User
}

// ========================
// Care Relationship Types
// ========================
export interface CareRelationship {
  id: string
  patient_id: string
  user_id: string
  relationship_type: string
  can_view_health: boolean
  can_manage_medications: boolean
  active: boolean
  patient?: PatientProfile
  user?: User
}

// ========================
// Medication Types
// ========================
export type MedicationStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface Medication {
  id: string
  patient_id: string
  medicine_name: string
  dosage: string
  instructions?: string
  start_date: string
  end_date?: string
  status: MedicationStatus
  stock_count?: number
  refill_threshold?: number
  created_at: string
}

export interface MedicationSchedule {
  id: string
  medication_id: string
  scheduled_time: string
  frequency: 'daily' | 'twice_daily' | 'thrice_daily' | 'weekly' | 'custom'
  timezone: string
  active: boolean
  medication?: Medication
}

export type DoseStatus = 'upcoming' | 'due' | 'taken' | 'late' | 'missed' | 'skipped'

export interface MedicationLog {
  id: string
  schedule_id: string
  patient_id: string
  scheduled_at: string
  status: DoseStatus
  recorded_at?: string
  created_at: string
  medication?: Medication
  schedule?: MedicationSchedule
}

// ========================
// Health Types
// ========================
export type MetricType = 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'heart_rate' | 'spo2' | 'blood_glucose' | 'temperature' | 'weight'

export interface HealthReading {
  id: string
  patient_id: string
  metric_type: MetricType
  value: number
  unit: string
  recorded_at: string
}

export interface HealthThreshold {
  id: string
  patient_id: string
  metric_type: MetricType
  min_value: number
  max_value: number
}

export const METRIC_CONFIG: Record<MetricType, { label: string; unit: string; icon: string; normalRange: { min: number; max: number }; color: string }> = {
  blood_pressure_systolic: { label: 'BP Systolic', unit: 'mmHg', icon: 'Heart', normalRange: { min: 90, max: 140 }, color: '#ef4444' },
  blood_pressure_diastolic: { label: 'BP Diastolic', unit: 'mmHg', icon: 'Heart', normalRange: { min: 60, max: 90 }, color: '#f97316' },
  heart_rate: { label: 'Heart Rate', unit: 'bpm', icon: 'Activity', normalRange: { min: 60, max: 100 }, color: '#ec4899' },
  spo2: { label: 'SpO2', unit: '%', icon: 'Wind', normalRange: { min: 95, max: 100 }, color: '#3b82f6' },
  blood_glucose: { label: 'Blood Glucose', unit: 'mg/dL', icon: 'Droplets', normalRange: { min: 70, max: 140 }, color: '#8b5cf6' },
  temperature: { label: 'Temperature', unit: '°F', icon: 'Thermometer', normalRange: { min: 97, max: 99.5 }, color: '#f59e0b' },
  weight: { label: 'Weight', unit: 'kg', icon: 'Scale', normalRange: { min: 45, max: 100 }, color: '#10b981' },
}

// ========================
// Emergency Types
// ========================
export type EmergencyEventType = 'sos' | 'fall_detected' | 'vital_alert' | 'missed_medication'
export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical'
export type EmergencyStatus = 'open' | 'acknowledged' | 'responding' | 'resolved'

export interface EmergencyEvent {
  id: string
  patient_id: string
  event_type: EmergencyEventType
  status: EmergencyStatus
  severity: EmergencySeverity
  description?: string
  created_at: string
  resolved_at?: string
  acknowledged_by?: string
}

export interface EmergencyContact {
  id: string
  patient_id: string
  contact_name: string
  phone: string
  relationship: string
  priority: number
}

// ========================
// Prescription Types
// ========================
export interface Prescription {
  id: string
  patient_id: string
  file_url?: string
  extracted_data?: PrescriptionExtraction
  verification_status: 'pending' | 'verified' | 'rejected'
  verified_by?: string
  created_at: string
}

export interface PrescriptionMedicine {
  name: string
  dosage: string
  frequency: string
  instructions: string
  duration: string
  confidence: number
  needs_confirmation: boolean
}

export interface PrescriptionExtraction {
  medicines: PrescriptionMedicine[]
  doctor_name?: string
  date?: string
  review_required: boolean
}

// ========================
// Notification Types
// ========================
export type NotificationType = 'medication_reminder' | 'missed_dose' | 'health_alert' | 'emergency' | 'care_task' | 'system' | 'appointment'

export interface AppNotification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read_at?: string
  created_at: string
  action_url?: string
  metadata?: Record<string, unknown>
}

// ========================
// Care Task Types
// ========================
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'

export interface CareTask {
  id: string
  patient_id: string
  assigned_to: string
  title: string
  description?: string
  due_at: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  created_at: string
  completed_at?: string
}

// ========================
// AI Insight Types
// ========================
export interface AIInsight {
  id: string
  patient_id: string
  category: 'medication' | 'health' | 'activity' | 'care_summary'
  summary: string
  evidence: string[]
  severity: 'info' | 'warning' | 'alert'
  created_at: string
}

// ========================
// Appointment Types
// ========================
export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  doctor?: DoctorProfile
}

// ========================
// Simulation Types
// ========================
export type SimulationEventType = 'missed_medication' | 'fall_detected' | 'emergency_sos' | 'abnormal_reading' | 'low_stock' | 'overdue_task'

export interface SimulationEvent {
  id: string
  type: SimulationEventType
  patient_name: string
  description: string
  timestamp: string
  processed: boolean
}

// ========================
// Dashboard Types
// ========================
export interface DashboardStats {
  totalMedications: number
  adherenceRate: number
  healthReadingsToday: number
  pendingTasks: number
  activeAlerts: number
  upcomingAppointments: number
}

export interface CareIntelligenceScore {
  overall: number
  medicationAdherence: number
  pendingTasks: number
  unresolvedAlerts: number
  dataFreshness: 'current' | 'stale' | 'outdated'
  lastUpdated: string
}
