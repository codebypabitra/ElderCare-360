import type {
  User, PatientProfile, Medication, MedicationSchedule, MedicationLog,
  HealthReading, EmergencyEvent, EmergencyContact, AppNotification,
  CareTask, CareRelationship, Appointment, AIInsight, SimulationEvent,
} from '@/types'
import { generateId } from '@/lib/utils'

// ========================
// Demo Users
// ========================
export const DEMO_USERS: User[] = [
  {
    id: 'user-patient-001',
    full_name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    role: 'patient',
    phone: '+91 98765 43210',
    avatar_url: '',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-family-001',
    full_name: 'Priya Kumar',
    email: 'priya@example.com',
    role: 'family',
    phone: '+91 98765 43211',
    avatar_url: '',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-caregiver-001',
    full_name: 'Sunita Devi',
    email: 'sunita@example.com',
    role: 'caregiver',
    phone: '+91 98765 43212',
    avatar_url: '',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-doctor-001',
    full_name: 'Dr. Anil Sharma',
    email: 'dr.anil@example.com',
    role: 'doctor',
    phone: '+91 98765 43213',
    avatar_url: '',
    created_at: '2024-01-01T00:00:00Z',
  },
]

// ========================
// Patient Profiles
// ========================
export const DEMO_PATIENT_PROFILES: PatientProfile[] = [
  {
    id: 'patient-001',
    user_id: 'user-patient-001',
    date_of_birth: '1952-03-15',
    blood_group: 'B+',
    address: 'Bhubaneswar, Odisha, India',
    emergency_status: 'normal',
    created_at: '2024-01-01T00:00:00Z',
    user: DEMO_USERS[0],
  },
]

// ========================
// Care Relationships
// ========================
export const DEMO_CARE_RELATIONSHIPS: CareRelationship[] = [
  {
    id: 'rel-001',
    patient_id: 'patient-001',
    user_id: 'user-family-001',
    relationship_type: 'daughter',
    can_view_health: true,
    can_manage_medications: true,
    active: true,
    user: DEMO_USERS[1],
  },
  {
    id: 'rel-002',
    patient_id: 'patient-001',
    user_id: 'user-caregiver-001',
    relationship_type: 'caregiver',
    can_view_health: true,
    can_manage_medications: false,
    active: true,
    user: DEMO_USERS[2],
  },
  {
    id: 'rel-003',
    patient_id: 'patient-001',
    user_id: 'user-doctor-001',
    relationship_type: 'doctor',
    can_view_health: true,
    can_manage_medications: true,
    active: true,
    user: DEMO_USERS[3],
  },
]

// ========================
// Medications
// ========================
const today = new Date().toISOString().split('T')[0]

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 'med-001',
    patient_id: 'patient-001',
    medicine_name: 'Amlodipine',
    dosage: '5mg',
    instructions: 'Take with water after breakfast',
    start_date: '2024-01-15',
    status: 'active',
    stock_count: 22,
    refill_threshold: 7,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'med-002',
    patient_id: 'patient-001',
    medicine_name: 'Metformin',
    dosage: '500mg',
    instructions: 'Take after lunch and dinner',
    start_date: '2024-02-01',
    status: 'active',
    stock_count: 15,
    refill_threshold: 10,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'med-003',
    patient_id: 'patient-001',
    medicine_name: 'Aspirin',
    dosage: '75mg',
    instructions: 'Take after dinner',
    start_date: '2024-01-20',
    status: 'active',
    stock_count: 30,
    refill_threshold: 7,
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'med-004',
    patient_id: 'patient-001',
    medicine_name: 'Calcium + Vitamin D3',
    dosage: '1 tablet',
    instructions: 'Take after breakfast',
    start_date: '2024-03-01',
    status: 'active',
    stock_count: 5,
    refill_threshold: 7,
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'med-005',
    patient_id: 'patient-001',
    medicine_name: 'Pantoprazole',
    dosage: '40mg',
    instructions: 'Take before breakfast on empty stomach',
    start_date: '2024-04-01',
    end_date: '2024-04-15',
    status: 'completed',
    stock_count: 0,
    refill_threshold: 5,
    created_at: '2024-04-01T00:00:00Z',
  },
]

// ========================
// Medication Schedules
// ========================
export const DEMO_SCHEDULES: MedicationSchedule[] = [
  {
    id: 'sched-001',
    medication_id: 'med-001',
    scheduled_time: '08:00',
    frequency: 'daily',
    timezone: 'Asia/Kolkata',
    active: true,
    medication: DEMO_MEDICATIONS[0],
  },
  {
    id: 'sched-002',
    medication_id: 'med-002',
    scheduled_time: '13:00',
    frequency: 'twice_daily',
    timezone: 'Asia/Kolkata',
    active: true,
    medication: DEMO_MEDICATIONS[1],
  },
  {
    id: 'sched-003',
    medication_id: 'med-002',
    scheduled_time: '20:00',
    frequency: 'twice_daily',
    timezone: 'Asia/Kolkata',
    active: true,
    medication: DEMO_MEDICATIONS[1],
  },
  {
    id: 'sched-004',
    medication_id: 'med-003',
    scheduled_time: '20:30',
    frequency: 'daily',
    timezone: 'Asia/Kolkata',
    active: true,
    medication: DEMO_MEDICATIONS[2],
  },
  {
    id: 'sched-005',
    medication_id: 'med-004',
    scheduled_time: '08:30',
    frequency: 'daily',
    timezone: 'Asia/Kolkata',
    active: true,
    medication: DEMO_MEDICATIONS[3],
  },
]

// ========================
// Medication Logs (recent 7 days)
// ========================
function generateMedicationLogs(): MedicationLog[] {
  const logs: MedicationLog[] = []
  const now = new Date()

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    const dateStr = day.toISOString().split('T')[0]

    // Amlodipine 8:00 AM
    logs.push({
      id: generateId(),
      schedule_id: 'sched-001',
      patient_id: 'patient-001',
      scheduled_at: `${dateStr}T08:00:00+05:30`,
      status: dayOffset === 0 ? 'upcoming' : (dayOffset === 2 ? 'missed' : 'taken'),
      recorded_at: dayOffset === 0 ? undefined : (dayOffset === 2 ? undefined : `${dateStr}T08:05:00+05:30`),
      created_at: `${dateStr}T00:00:00Z`,
      medication: DEMO_MEDICATIONS[0],
    })

    // Metformin 1:00 PM
    logs.push({
      id: generateId(),
      schedule_id: 'sched-002',
      patient_id: 'patient-001',
      scheduled_at: `${dateStr}T13:00:00+05:30`,
      status: dayOffset === 0 ? 'upcoming' : (dayOffset === 3 ? 'late' : 'taken'),
      recorded_at: dayOffset === 0 ? undefined : (dayOffset === 3 ? `${dateStr}T13:45:00+05:30` : `${dateStr}T13:02:00+05:30`),
      created_at: `${dateStr}T00:00:00Z`,
      medication: DEMO_MEDICATIONS[1],
    })

    // Metformin 8:00 PM
    logs.push({
      id: generateId(),
      schedule_id: 'sched-003',
      patient_id: 'patient-001',
      scheduled_at: `${dateStr}T20:00:00+05:30`,
      status: dayOffset === 0 ? 'upcoming' : 'taken',
      recorded_at: dayOffset === 0 ? undefined : `${dateStr}T20:03:00+05:30`,
      created_at: `${dateStr}T00:00:00Z`,
      medication: DEMO_MEDICATIONS[1],
    })

    // Aspirin 8:30 PM
    logs.push({
      id: generateId(),
      schedule_id: 'sched-004',
      patient_id: 'patient-001',
      scheduled_at: `${dateStr}T20:30:00+05:30`,
      status: dayOffset === 0 ? 'upcoming' : (dayOffset === 5 ? 'skipped' : 'taken'),
      recorded_at: dayOffset === 0 ? undefined : (dayOffset === 5 ? `${dateStr}T20:30:00+05:30` : `${dateStr}T20:32:00+05:30`),
      created_at: `${dateStr}T00:00:00Z`,
      medication: DEMO_MEDICATIONS[2],
    })

    // Calcium 8:30 AM
    logs.push({
      id: generateId(),
      schedule_id: 'sched-005',
      patient_id: 'patient-001',
      scheduled_at: `${dateStr}T08:30:00+05:30`,
      status: dayOffset === 0 ? 'upcoming' : 'taken',
      recorded_at: dayOffset === 0 ? undefined : `${dateStr}T08:35:00+05:30`,
      created_at: `${dateStr}T00:00:00Z`,
      medication: DEMO_MEDICATIONS[3],
    })
  }

  return logs
}

export const DEMO_MEDICATION_LOGS: MedicationLog[] = generateMedicationLogs()

// ========================
// Health Readings (last 14 days)
// ========================
function generateHealthReadings(): HealthReading[] {
  const readings: HealthReading[] = []
  const now = new Date()

  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    const dateStr = day.toISOString().split('T')[0]

    // Blood pressure
    readings.push({
      id: generateId(),
      patient_id: 'patient-001',
      metric_type: 'blood_pressure_systolic',
      value: 120 + Math.floor(Math.random() * 25) - 5,
      unit: 'mmHg',
      recorded_at: `${dateStr}T09:00:00+05:30`,
    })
    readings.push({
      id: generateId(),
      patient_id: 'patient-001',
      metric_type: 'blood_pressure_diastolic',
      value: 75 + Math.floor(Math.random() * 15) - 5,
      unit: 'mmHg',
      recorded_at: `${dateStr}T09:00:00+05:30`,
    })

    // Heart rate
    readings.push({
      id: generateId(),
      patient_id: 'patient-001',
      metric_type: 'heart_rate',
      value: 70 + Math.floor(Math.random() * 20) - 5,
      unit: 'bpm',
      recorded_at: `${dateStr}T09:00:00+05:30`,
    })

    // SpO2
    readings.push({
      id: generateId(),
      patient_id: 'patient-001',
      metric_type: 'spo2',
      value: 95 + Math.floor(Math.random() * 5),
      unit: '%',
      recorded_at: `${dateStr}T09:00:00+05:30`,
    })

    // Blood glucose (every other day)
    if (dayOffset % 2 === 0) {
      readings.push({
        id: generateId(),
        patient_id: 'patient-001',
        metric_type: 'blood_glucose',
        value: 100 + Math.floor(Math.random() * 40) - 10,
        unit: 'mg/dL',
        recorded_at: `${dateStr}T07:00:00+05:30`,
      })
    }

    // Temperature (every 3 days)
    if (dayOffset % 3 === 0) {
      readings.push({
        id: generateId(),
        patient_id: 'patient-001',
        metric_type: 'temperature',
        value: 97.5 + Math.random() * 1.5,
        unit: '°F',
        recorded_at: `${dateStr}T10:00:00+05:30`,
      })
    }
  }

  return readings
}

export const DEMO_HEALTH_READINGS: HealthReading[] = generateHealthReadings()

// ========================
// Emergency Contacts
// ========================
export const DEMO_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-001',
    patient_id: 'patient-001',
    contact_name: 'Priya Kumar',
    phone: '+91 98765 43211',
    relationship: 'Daughter',
    priority: 1,
  },
  {
    id: 'ec-002',
    patient_id: 'patient-001',
    contact_name: 'Sunita Devi',
    phone: '+91 98765 43212',
    relationship: 'Caregiver',
    priority: 2,
  },
  {
    id: 'ec-003',
    patient_id: 'patient-001',
    contact_name: 'Dr. Anil Sharma',
    phone: '+91 98765 43213',
    relationship: 'Doctor',
    priority: 3,
  },
]

// ========================
// Emergency Events
// ========================
export const DEMO_EMERGENCY_EVENTS: EmergencyEvent[] = [
  {
    id: 'emg-001',
    patient_id: 'patient-001',
    event_type: 'missed_medication',
    status: 'resolved',
    severity: 'medium',
    description: 'Amlodipine 5mg missed at 08:00 AM',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
  },
]

// ========================
// Notifications
// ========================
export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    user_id: 'user-patient-001',
    title: 'Medication Reminder',
    message: 'Time to take Amlodipine 5mg',
    type: 'medication_reminder',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-002',
    user_id: 'user-family-001',
    title: 'Missed Dose Alert',
    message: 'Ramesh Kumar missed Amlodipine 5mg scheduled for 08:00 AM',
    type: 'missed_dose',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'notif-003',
    user_id: 'user-patient-001',
    title: 'Low Medicine Stock',
    message: 'Calcium + Vitamin D3 has only 5 tablets remaining. Please arrange a refill.',
    type: 'system',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-004',
    user_id: 'user-patient-001',
    title: 'Health Reading Recorded',
    message: 'Blood pressure reading 135/82 mmHg recorded successfully.',
    type: 'health_alert',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'notif-005',
    user_id: 'user-caregiver-001',
    title: 'Care Task Assigned',
    message: 'New task: Check on Ramesh Kumar\'s blood pressure reading.',
    type: 'care_task',
    created_at: new Date(Date.now() - 5400000).toISOString(),
  },
]

// ========================
// Care Tasks
// ========================
export const DEMO_CARE_TASKS: CareTask[] = [
  {
    id: 'task-001',
    patient_id: 'patient-001',
    assigned_to: 'user-caregiver-001',
    title: 'Morning medication supervision',
    description: 'Ensure Ramesh takes his morning medications (Amlodipine, Calcium)',
    due_at: `${today}T09:00:00+05:30`,
    status: 'pending',
    priority: 'high',
    created_at: `${today}T00:00:00Z`,
  },
  {
    id: 'task-002',
    patient_id: 'patient-001',
    assigned_to: 'user-caregiver-001',
    title: 'Record blood pressure',
    description: 'Take and record morning blood pressure reading',
    due_at: `${today}T10:00:00+05:30`,
    status: 'pending',
    priority: 'medium',
    created_at: `${today}T00:00:00Z`,
  },
  {
    id: 'task-003',
    patient_id: 'patient-001',
    assigned_to: 'user-family-001',
    title: 'Refill Calcium + Vitamin D3',
    description: 'Only 5 tablets remaining. Please order a refill.',
    due_at: `${today}T18:00:00+05:30`,
    status: 'pending',
    priority: 'medium',
    created_at: `${today}T00:00:00Z`,
  },
  {
    id: 'task-004',
    patient_id: 'patient-001',
    assigned_to: 'user-caregiver-001',
    title: 'Evening walk supervision',
    description: 'Accompany Ramesh for his 30-minute evening walk',
    due_at: `${today}T17:30:00+05:30`,
    status: 'pending',
    priority: 'low',
    created_at: `${today}T00:00:00Z`,
  },
]

// ========================
// Appointments
// ========================
export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patient_id: 'patient-001',
    doctor_id: 'user-doctor-001',
    appointment_at: new Date(Date.now() + 3 * 86400000).toISOString(),
    status: 'scheduled',
    notes: 'Regular check-up and BP review',
    created_at: new Date().toISOString(),
  },
]

// ========================
// AI Insights
// ========================
export const DEMO_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-001',
    patient_id: 'patient-001',
    category: 'medication',
    summary: 'Evening medication adherence is strong at 96%. Morning Amlodipine was missed 2 days ago — consider a caregiver check-in for the morning schedule.',
    evidence: ['Amlodipine missed on Day 5', '28 of 30 total doses taken in the last week'],
    severity: 'info',
    created_at: new Date().toISOString(),
  },
  {
    id: 'insight-002',
    patient_id: 'patient-001',
    category: 'health',
    summary: 'Blood pressure readings have been slightly elevated over the past 3 days (average 138/84 mmHg). All readings remain within the configured threshold but trending upward.',
    evidence: ['Day 1: 135/82', 'Day 2: 138/85', 'Day 3: 140/86'],
    severity: 'warning',
    created_at: new Date().toISOString(),
  },
  {
    id: 'insight-003',
    patient_id: 'patient-001',
    category: 'care_summary',
    summary: 'Daily Care Summary: 4 of 5 medication doses recorded as taken. One dose was missed (Amlodipine). Two health readings were recorded. One caregiver task remains pending.',
    evidence: ['Medication adherence: 80% today', '2 health readings logged', '1 pending care task'],
    severity: 'info',
    created_at: new Date().toISOString(),
  },
]

// ========================
// Simulation Events
// ========================
export const INITIAL_SIMULATION_EVENTS: SimulationEvent[] = []
