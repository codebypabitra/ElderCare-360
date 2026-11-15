# ElderCare 360 — Smarter Care. Safer Living. Connected Families.

> **AI-Powered Preventive Elderly Care and Family Coordination Platform**  
> *Fully Connected to Live Supabase PostgreSQL with Real-Time Telemetry Sync*

---

## ⚡ Live Supabase Realtime Telemetry Connected

This application is connected directly to your cloud Supabase database:
- **Project URL:** `https://msheryqagewdcdgyvxbg.supabase.co`
- **Key:** `sb_publishable_TZhqvKdigZzaDZeHUWyVXw_wCEpyxJ6`
- **Realtime Postgres Replication:** Active across `medications`, `medication_logs`, `health_readings`, `emergency_events`, `care_tasks`, and `notifications`.

---

## 🚀 Setting Up & Seeding Your Supabase Database

To populate your Supabase PostgreSQL database with the complete clinical seed data (Mr. Ramesh, Priya, Sunita, Dr. Anil, medications, health vitals, emergency contacts, and care tasks):

1. Open your Supabase Project's SQL Editor:  
   👉 **[https://supabase.com/dashboard/project/msheryqagewdcdgyvxbg/sql/new](https://supabase.com/dashboard/project/msheryqagewdcdgyvxbg/sql/new)**
2. Copy and paste the entire script from **[`supabase/setup_and_seed.sql`](supabase/setup_and_seed.sql)** into the SQL editor.
3. Click **Run** (or `Ctrl + Enter`).
4. That's it! Your tables, policies, and seed rows are immediately live, and any modifications from the web app will directly insert, update, and sync across all connected clients in real time!

---

## 🌟 Overview & Differentiator

**ElderCare 360** is not merely a pill reminder app. It is an **integrated preventive elderly care ecosystem** linking elderly seniors living alone, distant family members, visiting attendants, and consulting physicians through a single connected engine.

### The Differentiator: Care Intelligence Engine™
Instead of siloed data, the **Care Intelligence Engine** computes a transparent composite safety score:
$$\text{Care Score} = 0.40 \times \text{Adherence} + 0.25 \times \text{Tasks} + 0.20 \times \text{Alerts} + 0.15 \times \text{Freshness}$$

---

## 🚀 Key Modules Built & Ready to Demo

| Module | Route | Functionality |
| :--- | :--- | :--- |
| **Landing & Persona Launchpad** | `/` | Overview of the 5 pillars, architecture, and 1-click role switcher |
| **Persona Login** | `/login` | High-contrast personas: Ramesh (Patient), Priya (Family), Sunita (Caregiver), Dr. Anil (Doctor) |
| **Elderly Patient Dashboard** | `/patient/dashboard` | Large touch targets, today's schedule, one-tap "I Took This", live vitals snapshot, and SOS |
| **Medication Intelligence** | `/patient/medications` | Full CRUD, schedules, 7-day adherence calculations, low-stock warnings, and occurrence logs |
| **Health Telemetry & Trends** | `/patient/health` | Vitals logging (BP, HR, SpO2, Glucose, Temp) with interactive 10-day Recharts trajectories |
| **Regional AI Companion** | `/patient/assistant` | Context-aware AI with speech synthesis (TTS) supporting English, Hindi, and Odia (ଓଡ଼ିଆ) |
| **Emergency SOS & Fall Engine** | `/patient/emergency` | High-priority SOS siren, 15-second fall detection simulation countdown, and emergency contacts cascade |
| **Family Coordination Hub** | `/family/dashboard` | Remote oversight, missed-dose escalation logs, caregiver supervision, and weekly insights |
| **Comprehensive Patient Record** | `/family/patient/:id` | DPDP-compliant consent-controlled patient file, care relationships, and permissions |
| **Caregiver Duty Dashboard** | `/caregiver/dashboard` | Shift supervision checklist, task completion checkoffs, and patient quick stats |
| **Task Management** | `/caregiver/tasks` | Create, filter, and audit scheduled elder care tasks |
| **Doctor Oversight Portal** | `/doctor/dashboard` | Cardiovascular risk stratification, 14-day telemetry trends, and clinical alerts |
| **AI Prescription OCR Studio** | `/doctor/prescriptions` | Upload medical slips, run simulated OCR entity extraction, verify confidence, and commit to schedules |
| **Simulation Lab (Judge Center)** | `/demo` | **Interactive demo control center** to simulate falls, missed doses, high BP spikes, low stock, and measure real metrics |
| **Health Reports Dossier** | `/reports` | Printable/exportable clinical care summary with evidence-based AI insights |
| **Settings & Supabase Sync** | `/settings` | Live Supabase latency tester, sync triggers, threshold configurations, and SQL setup scripts |

---

## 🛠️ Technology Architecture

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Accessible UI Design (Large fonts, high contrast, WCAG compliant)
- **Data Visualizations:** Recharts (Multi-metric physiological charts)
- **State & Telemetry:** Dynamic React Context with live Supabase client & real-time Postgres channels
- **Backend & Database:** PostgreSQL via Supabase Schema (`supabase/setup_and_seed.sql` with Realtime Publications)
- **Icons & UI:** Lucide React + CVA (Class Variance Authority)

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates production-optimized chunks in `dist/`.
