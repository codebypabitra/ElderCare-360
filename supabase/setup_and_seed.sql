-- =====================================================================
-- ElderCare 360 — Full Supabase Realtime Setup & Live Seed Script
-- Run this in your Supabase Project's SQL Editor:
-- https://supabase.com/dashboard/project/msheryqagewdcdgyvxbg/sql/new
-- =====================================================================

create extension if not exists pgcrypto;

-- 1. DROP EXISTING CONSTRAINTS TO ALLOW CLEAN SEEDING
drop table if exists public.emergency_events cascade;
drop table if exists public.emergency_contacts cascade;
drop table if exists public.care_tasks cascade;
drop table if exists public.health_readings cascade;
drop table if exists public.health_thresholds cascade;
drop table if exists public.medication_logs cascade;
drop table if exists public.medication_schedules cascade;
drop table if exists public.medications cascade;
drop table if exists public.care_relationships cascade;
drop table if exists public.doctor_profiles cascade;
drop table if exists public.patient_profiles cascade;
drop table if exists public.notifications cascade;
drop table if exists public.ai_insights cascade;
drop table if exists public.appointments cascade;
drop table if exists public.users cascade;

-- 2. CREATE CORE TABLES
create table public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('patient', 'family', 'caregiver', 'doctor', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

create table public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  date_of_birth date,
  blood_group text,
  address text,
  emergency_status text not null default 'normal',
  created_at timestamptz default now()
);

create table public.doctor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  specialization text not null,
  license_number text,
  verification_status text not null default 'verified',
  created_at timestamptz default now()
);

create table public.care_relationships (
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

create table public.medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  medicine_name text not null,
  dosage text not null,
  instructions text,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active',
  stock_count integer default 30,
  refill_threshold integer default 7,
  created_at timestamptz default now()
);

create table public.medication_schedules (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id) on delete cascade,
  scheduled_time time not null,
  frequency text not null default 'daily',
  timezone text not null default 'Asia/Kolkata',
  active boolean default true
);

create table public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references public.medication_schedules(id) on delete set null,
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  scheduled_at timestamptz not null default now(),
  status text not null default 'upcoming',
  recorded_at timestamptz,
  created_at timestamptz default now()
);

create table public.health_readings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  metric_type text not null,
  value numeric not null,
  unit text not null,
  recorded_at timestamptz default now()
);

create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  contact_name text not null,
  phone text not null,
  relationship text not null,
  priority integer not null default 1
);

create table public.emergency_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  event_type text not null,
  status text not null default 'open',
  severity text not null default 'high',
  description text,
  acknowledged_by uuid references public.users(id),
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create table public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  assigned_to uuid references public.users(id),
  title text not null,
  description text,
  due_at timestamptz not null default now(),
  status text not null default 'pending',
  priority text not null default 'medium',
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  category text not null,
  summary text not null,
  evidence jsonb not null default '[]'::jsonb,
  severity text not null default 'info',
  created_at timestamptz default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patient_profiles(id) on delete cascade,
  doctor_id uuid references public.users(id),
  appointment_at timestamptz not null default (now() + interval '3 days'),
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz default now()
);

-- 3. ENABLE ANONYMOUS ACCESS POLICIES (Full CRUD via publishable key)
alter table public.users enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.care_relationships enable row level security;
alter table public.medications enable row level security;
alter table public.medication_schedules enable row level security;
alter table public.medication_logs enable row level security;
alter table public.health_readings enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.emergency_events enable row level security;
alter table public.care_tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_insights enable row level security;
alter table public.appointments enable row level security;

-- Open policies for anon & authenticated roles
create policy "Anon full access users" on public.users for all using (true) with check (true);
create policy "Anon full access patient_profiles" on public.patient_profiles for all using (true) with check (true);
create policy "Anon full access doctor_profiles" on public.doctor_profiles for all using (true) with check (true);
create policy "Anon full access care_relationships" on public.care_relationships for all using (true) with check (true);
create policy "Anon full access medications" on public.medications for all using (true) with check (true);
create policy "Anon full access medication_schedules" on public.medication_schedules for all using (true) with check (true);
create policy "Anon full access medication_logs" on public.medication_logs for all using (true) with check (true);
create policy "Anon full access health_readings" on public.health_readings for all using (true) with check (true);
create policy "Anon full access emergency_contacts" on public.emergency_contacts for all using (true) with check (true);
create policy "Anon full access emergency_events" on public.emergency_events for all using (true) with check (true);
create policy "Anon full access care_tasks" on public.care_tasks for all using (true) with check (true);
create policy "Anon full access notifications" on public.notifications for all using (true) with check (true);
create policy "Anon full access ai_insights" on public.ai_insights for all using (true) with check (true);
create policy "Anon full access appointments" on public.appointments for all using (true) with check (true);

-- 4. ENABLE REALTIME REPLICATION FOR LIVE TELEMETRY
alter publication supabase_realtime add table public.medications;
alter publication supabase_realtime add table public.medication_logs;
alter publication supabase_realtime add table public.health_readings;
alter publication supabase_realtime add table public.emergency_events;
alter publication supabase_realtime add table public.care_tasks;
alter publication supabase_realtime add table public.notifications;

-- 5. SEED INITIAL CLINICAL DATA
do $$
declare
  u_patient uuid := 'd1a1b1c1-0001-4000-8000-000000000001'::uuid;
  u_family  uuid := 'd1a1b1c1-0002-4000-8000-000000000002'::uuid;
  u_care    uuid := 'd1a1b1c1-0003-4000-8000-000000000003'::uuid;
  u_doc     uuid := 'd1a1b1c1-0004-4000-8000-000000000004'::uuid;
  p_id      uuid := 'e1a1b1c1-0001-4000-8000-000000000001'::uuid;
  m1        uuid := 'f1a1b1c1-0001-4000-8000-000000000001'::uuid;
  m2        uuid := 'f1a1b1c1-0002-4000-8000-000000000002'::uuid;
  m3        uuid := 'f1a1b1c1-0003-4000-8000-000000000003'::uuid;
  m4        uuid := 'f1a1b1c1-0004-4000-8000-000000000004'::uuid;
  s1        uuid := 'a1a1b1c1-0001-4000-8000-000000000001'::uuid;
  s2        uuid := 'a1a1b1c1-0002-4000-8000-000000000002'::uuid;
begin
  -- Users
  insert into public.users (id, full_name, email, role, phone) values
    (u_patient, 'Ramesh Kumar', 'ramesh@example.com', 'patient', '+91 98765 43210'),
    (u_family, 'Priya Kumar', 'priya@example.com', 'family', '+91 98765 43211'),
    (u_care, 'Sunita Devi', 'sunita@example.com', 'caregiver', '+91 98765 43212'),
    (u_doc, 'Dr. Anil Sharma', 'dr.anil@example.com', 'doctor', '+91 98765 43213')
  on conflict (id) do nothing;

  -- Patient Profile
  insert into public.patient_profiles (id, user_id, date_of_birth, blood_group, address, emergency_status) values
    (p_id, u_patient, '1952-03-15', 'B+', 'Bhubaneswar, Odisha, India', 'normal')
  on conflict (id) do nothing;

  -- Care Relationships
  insert into public.care_relationships (patient_id, user_id, relationship_type, can_view_health, can_manage_medications) values
    (p_id, u_family, 'daughter', true, true),
    (p_id, u_care, 'caregiver', true, false),
    (p_id, u_doc, 'doctor', true, true)
  on conflict (patient_id, user_id) do nothing;

  -- Emergency Contacts
  insert into public.emergency_contacts (patient_id, contact_name, phone, relationship, priority) values
    (p_id, 'Priya Kumar', '+91 98765 43211', 'Daughter', 1),
    (p_id, 'Sunita Devi', '+91 98765 43212', 'Caregiver', 2),
    (p_id, 'Dr. Anil Sharma', '+91 98765 43213', 'Cardiologist', 3);

  -- Medications
  insert into public.medications (id, patient_id, medicine_name, dosage, instructions, start_date, stock_count, refill_threshold) values
    (m1, p_id, 'Amlodipine', '5mg', 'Take with water after breakfast', current_date - 30, 22, 7),
    (m2, p_id, 'Metformin', '500mg', 'Take after lunch and dinner', current_date - 20, 15, 10),
    (m3, p_id, 'Aspirin', '75mg', 'Take after dinner with milk', current_date - 40, 28, 7),
    (m4, p_id, 'Calcium + Vitamin D3', '1 tablet', 'Take after breakfast', current_date - 10, 4, 7)
  on conflict (id) do nothing;

  -- Schedules
  insert into public.medication_schedules (id, medication_id, scheduled_time, frequency) values
    (s1, m1, '08:00:00', 'daily'),
    (s2, m2, '13:00:00', 'twice_daily')
  on conflict (id) do nothing;

  -- Today Medication Logs
  insert into public.medication_logs (schedule_id, patient_id, scheduled_at, status) values
    (s1, p_id, (current_date || ' 08:00:00+05:30')::timestamptz, 'taken'),
    (s2, p_id, (current_date || ' 13:00:00+05:30')::timestamptz, 'upcoming');

  -- Health Readings (Past 7 days)
  insert into public.health_readings (patient_id, metric_type, value, unit, recorded_at) values
    (p_id, 'blood_pressure_systolic', 124, 'mmHg', now() - interval '1 day'),
    (p_id, 'blood_pressure_diastolic', 82, 'mmHg', now() - interval '1 day'),
    (p_id, 'heart_rate', 72, 'bpm', now() - interval '1 day'),
    (p_id, 'spo2', 98, '%', now() - interval '1 day'),
    (p_id, 'blood_glucose', 114, 'mg/dL', now() - interval '1 day'),
    (p_id, 'temperature', 98.4, '°F', now() - interval '1 day'),
    (p_id, 'blood_pressure_systolic', 130, 'mmHg', now()),
    (p_id, 'blood_pressure_diastolic', 84, 'mmHg', now()),
    (p_id, 'heart_rate', 76, 'bpm', now()),
    (p_id, 'spo2', 99, '%', now());

  -- Care Tasks
  insert into public.care_tasks (patient_id, assigned_to, title, description, due_at, status, priority) values
    (p_id, u_care, 'Morning medication supervision', 'Ensure Ramesh takes Amlodipine & Calcium', now() + interval '2 hours', 'pending', 'high'),
    (p_id, u_care, 'Record morning blood pressure', 'Take reading 30 mins after waking', now() + interval '3 hours', 'pending', 'medium'),
    (p_id, u_family, 'Refill Calcium + Vitamin D3', 'Low stock alert (4 tablets remaining)', now() + interval '8 hours', 'pending', 'medium');

  -- Notifications
  insert into public.notifications (user_id, title, message, type) values
    (u_patient, 'Medication Due', 'Time to take Metformin 500mg after lunch.', 'medication_reminder'),
    (u_patient, 'Low Supply Alert', 'Calcium + D3 has only 4 tablets remaining.', 'system'),
    (u_family, 'Daily Telemetry Sync', 'All morning vitals for Ramesh Kumar within normal range.', 'health_alert');

  -- AI Insights
  insert into public.ai_insights (patient_id, category, summary, evidence) values
    (p_id, 'medication', 'Overall 7-day adherence is strong at 94%. Morning routine is highly consistent.', '["28 of 30 scheduled doses taken", "Zero adverse interactions recorded"]'::jsonb),
    (p_id, 'health', 'Systolic blood pressure averages 126 mmHg over the past week, within Dr. Sharma target.', '["Mean BP 126/82", "SpO2 maintained >= 98%"]'::jsonb);

  -- Appointments
  insert into public.appointments (patient_id, doctor_id, appointment_at, status, notes) values
    (p_id, u_doc, now() + interval '3 days', 'scheduled', 'Quarterly Cardiology review & BP consultation');

end $$;
