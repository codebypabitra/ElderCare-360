import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Users, HeartPulse, Pill, Activity, ShieldCheck,
  Calendar, Phone, MapPin, Droplet, User, CheckCircle2, Lock
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatDate } from '@/lib/utils'

export default function PatientCarePage() {
  const { id } = useParams()
  const {
    getPatientProfiles,
    getCareRelationships,
    getEmergencyContacts,
    medications,
    healthReadings,
    getAdherenceRate
  } = useApp()

  const profiles = getPatientProfiles()
  const patient = profiles[0]
  const relationships = getCareRelationships()
  const contacts = getEmergencyContacts()
  const adherence = getAdherenceRate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comprehensive Patient Record"
        subtitle="Consent-managed clinical file, authorized care circle, and biometrics archive."
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              DPDP 2023 Consent Active
            </span>
          </div>
        }
      />

      {/* Main Demographics Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              RK
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900">{patient.user?.full_name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Patient #001
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span>DOB: {patient.date_of_birth} (Age 72)</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <Droplet className="h-3.5 w-3.5" /> Blood: {patient.blood_group}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {patient.address}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500 font-medium">Weekly Adherence</p>
              <p className="text-2xl font-black text-emerald-600">{adherence}%</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500 font-medium">Active Prescriptions</p>
              <p className="text-2xl font-black text-blue-600">
                {medications.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Care Circle & Emergency Relatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authorized Care Circle */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-indigo-600" />
            Authorized Care Circle & Granular Permissions
          </h3>
          <div className="space-y-3">
            {relationships.map(rel => (
              <div key={rel.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{rel.user?.full_name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
                      {rel.relationship_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{rel.user?.email} · {rel.user?.phone}</p>
                  <div className="flex gap-2 mt-2">
                    {rel.can_view_health && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Health Vitals Telemetry
                      </span>
                    )}
                    {rel.can_manage_medications && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        ✓ Prescription Management
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts Priority Chain */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-red-600" />
            Automated Emergency Broadcast Cascade
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            When an SOS or unacknowledged fall occurs, distress SMS/calls ring in priority order:
          </p>

          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-red-100 text-red-700 font-black text-sm flex items-center justify-center shrink-0">
                    {c.priority}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{c.contact_name}</p>
                    <p className="text-xs text-slate-500">{c.relationship} · {c.phone}</p>
                  </div>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
