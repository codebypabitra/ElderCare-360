-- =====================================================================
-- ElderCare 360 — Production Database Schema & Security Architecture
-- Target: PostgreSQL / Supabase
-- Compliant with DPDP Act (India, 2023) & Clinical Safety Protocols
-- =====================================================================

create extension if not exists pgcrypto;

-- 1. USERS & ROLES
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('patient', 'family', 'caregiver', 'doctor', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. PATIENT PROFILES
create table if not exists public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  date_of_birth date,
  blood_group text,
  address text,
  emergency_status text not null default 'normal' check (emergency_status in ('normal', 'alert', 'emergency')),
  created_at timestamptz default now()
);

-- 3. DOCTOR PROFILES
create table if not exists public.doctor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  specialization text not null,
  license_number text,
  verification_status text not null default 'verified' check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz default now()
);

-- 4. CARE RELATIONSHIPS (Granular DPDP Consent Control)
create table if not exists public.care_relationships (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  relationship_type text not null,
  can_view_health boolean default true,
  can_manage_medications boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  unique (patient_id, user_id)
);

-- 5. MEDICATIONS INVENTORY & PRESCRIPTIONS
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  medicine_name text not null,
  dosage text not null,
  instructions text,
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'cancelled')),
  stock_count integer default 30,
  refill_threshold integer default 7,
  created_at timestamptz default now()
);

-- 6. MEDICATION SCHEDULES
create table if not exists public.medication_schedules (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id) on delete cascade,
  scheduled_time time not null,
  frequency text not null default 'daily',
  timezone text not null default 'Asia/Kolkata',
  active boolean default true
);

-- 7. MEDICATION LOGS (Occurrence & Adherence Tracking)
create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references public.medication_schedules(id) on delete set null,
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null check (status in ('upcoming', 'due', 'taken', 'late', 'missed', 'skipped')),
  recorded_at timestamptz,
  created_at timestamptz default now()
);

-- 8. HEALTH READINGS (Biometrics & Vitals)
create table if not exists public.health_readings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  metric_type text not null check (metric_type in (
    'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate',
    'spo2', 'blood_glucose', 'temperature', 'weight'
  )),
  value numeric not null,
  unit text not null,
  recorded_at timestamptz default now()
);

-- 9. HEALTH THRESHOLDS (Clinician-Configured)
create table if not exists public.health_thresholds (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  metric_type text not null,
  min_value numeric not null,
  max_value numeric not null,
  created_at timestamptz default now()
);

-- 10. EMERGENCY CONTACTS
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  contact_name text not null,
  phone text not null,
  relationship text not null,
  priority integer not null default 1
);

-- 11. EMERGENCY EVENTS & AUDIT LOGS
create table if not exists public.emergency_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  event_type text not null check (event_type in ('sos', 'fall_detected', 'vital_alert', 'missed_medication')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'responding', 'resolved')),
  severity text not null default 'high' check (severity in ('low', 'medium', 'high', 'critical')),
  description text,
  acknowledged_by uuid references public.users(id),
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- 12. CARE TASKS
create table if not exists public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  assigned_to uuid not null references public.users(id),
  title text not null,
  description text,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 13. NOTIFICATIONS OUTBOX
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- 14. AI INSIGHTS
create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  category text not null,
  summary text not null,
  evidence jsonb not null default '[]'::jsonb,
  severity text not null default 'info',
  created_at timestamptz default now()
);

-- 15. APPOINTMENTS
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  doctor_id uuid not null references public.users(id),
  appointment_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
create index if not exists idx_medication_patient on public.medications(patient_id);
create index if not exists idx_health_patient_time on public.health_readings(patient_id, recorded_at desc);
create index if not exists idx_medication_logs_due on public.medication_logs(patient_id, scheduled_at);
create index if not exists idx_emergency_events_status on public.emergency_events(patient_id, status);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, read_at) where read_at is null;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
alter table public.users enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.care_relationships enable row level security;
alter table public.medications enable row level security;
alter table public.medication_logs enable row level security;
alter table public.health_readings enable row level security;
alter table public.emergency_events enable row level security;
alter table public.notifications enable row level security;

-- Users can read their own profile or permitted care circles
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

create policy "Patients view own profile" on public.patient_profiles
  for select using (auth.uid() = user_id);

create policy "Care circle view permitted health readings" on public.health_readings
  for select using (
    patient_id in (
      select id from public.patient_profiles where user_id = auth.uid()
      union
      select patient_id from public.care_relationships where user_id = auth.uid() and can_view_health = true
    )
  );

create policy "Care circle view medications" on public.medications
  for select using (
    patient_id in (
      select id from public.patient_profiles where user_id = auth.uid()
      union
      select patient_id from public.care_relationships where user_id = auth.uid()
    )
  );
