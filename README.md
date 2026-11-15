# ElderCare 360 — Smarter Care. Safer Living. Connected Families.

> **AI-Powered Preventive Elderly Care and Family Coordination Platform**  
> *Hackathon Execution Blueprint & Production-Ready Prototype*

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
| **Settings & Thresholds** | `/settings` | Configurable clinician BP/grace limits, notification channels, and Supabase status |

---

## 🛠️ Technology Architecture

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Accessible UI Design (Large fonts, high contrast, WCAG compliant)
- **Data Visualizations:** Recharts (Multi-metric physiological charts)
- **State & Telemetry:** Dynamic React Context with persistence & live simulation processor
- **Backend & Database:** PostgreSQL via Supabase Schema (`supabase/schema.sql` with Row Level Security)
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

---

## 🧪 Hackathon Judge Demo Script (3-Minute Tour)

1. **Act 1 — Introduce Mr. Ramesh (Age 72):**
   - Navigate to `/` and click **"Try as Patient"** (Mr. Ramesh Kumar).
   - Show the simple high-contrast dashboard. Click **"I Took This ✓"** on his morning Amlodipine.
   - Point out the **Care Intelligence Score (86/100)** update.

2. **Act 2 — Regional AI Companion:**
   - Go to `/patient/assistant`.
   - Click the Odia query: *"Explain my medicines in simple Odia (ଓଡ଼ିଆରେ କୁହନ୍ତୁ)"*.
   - Click the **"Listen"** voice button to hear the synthesized audio.

3. **Act 3 — Emergency & Fall Detection:**
   - Go to `/patient/emergency` and click **"Simulate Motion Fall Event"**.
   - Show the 15-second countdown banner (*"Mr. Ramesh, are you unhurt?"*).
   - Let it expire or press *"I Need Help"* to show the live escalation.

4. **Act 4 — Family Oversight:**
   - Click **"Switch Account"** in sidebar and select **Priya Kumar (Family)**.
   - Observe the real-time missed-dose notification and emergency banner on `/family/dashboard`.

5. **Act 5 — AI Prescription OCR Scanner:**
   - Switch to **Dr. Anil Sharma (Doctor)**.
   - Go to `/doctor/prescriptions`. Click the cardiology sample slip.
   - Watch the AI extract **Telmisartan 40mg**, **Atorvastatin 10mg**, and **Multivitamin**.
   - Click **"Approve & Schedule For Patient"** to verify automatic schedule creation.

6. **Act 6 — Interactive Simulation Lab:**
   - Visit `/demo` to show the judges live measurable outcomes: scheduled doses, taken vs missed counts, and live telemetry triggers.

---

## 🛡️ India DPDP Act 2023 Compliance
- Explicit consent recorded in `public.care_relationships`.
- Patient-owned emergency contacts priority chain.
- No hallucinations: All AI explanations are grounded strictly in stored health and medication rows.
