import { useParams } from 'react-router-dom'
import {
  Users, ShieldCheck, MapPin, Droplet, Phone
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'

export default function PatientCarePage() {
  const { id } = useParams()
  const {
    getPatientProfiles,
    getCareRelationships,
    getEmergencyContacts,
    medications,
    getAdherenceRate
  } = useApp()

  const profiles = getPatientProfiles()
  const patient = profiles[0]
  const relationships = getCareRelationships()
  const contacts = getEmergencyContacts()
  const adherence = getAdherenceRate()

  return (
    <div className="space-y-6 text-[#1C1917]">
      <PageHeader
        title="Comprehensive Patient Record (ରମେଶ କୁମାରଙ୍କ ବିବରଣୀ)"
        subtitle="Consent-managed clinical file, authorized care circle, and biometrics archive."
        action={
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#059669]" />
              DPDP Act 2023 India Consent Active
            </span>
          </div>
        }
      />

      {/* Main Demographics Header Card */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-[#FFEDD5] text-[#9A3412] font-black text-2xl flex items-center justify-center border-2 border-[#FED7AA] shrink-0 font-serif">
              RK
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-[#1C1917] font-serif">{patient.user?.full_name} Ji</h2>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                  Senior Citizen #001
                </span>
              </div>
              <p className="text-sm text-[#57534E] mt-1 flex items-center gap-2">
                <span>DOB: {patient.date_of_birth} (Age 72)</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-semibold text-[#DC2626]">
                  <Droplet className="h-3.5 w-3.5" /> Blood Group: {patient.blood_group}
                </span>
              </p>
              <p className="text-xs text-[#78716C] mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#C2410C]" /> {patient.address}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE3D8]">
            <div className="text-center sm:text-right">
              <p className="text-xs text-[#78716C] font-medium">Weekly Adherence</p>
              <p className="text-2xl font-black text-[#059669] font-serif">{adherence}%</p>
            </div>
            <div className="h-10 w-[1px] bg-[#EAE3D8] hidden sm:block"></div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-[#78716C] font-medium">Active Prescriptions</p>
              <p className="text-2xl font-black text-[#C2410C] font-serif">
                {medications.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Care Circle & Emergency Relatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authorized Care Circle */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-[#1C1917] font-serif flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-[#C2410C]" />
            Authorized Parivaar Circle & Granular Permissions
          </h3>
          <div className="space-y-3">
            {relationships.map(rel => (
              <div key={rel.id} className="p-4 rounded-2xl border border-[#EAE3D8] bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#1C1917]">{rel.user?.full_name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAE3D8] text-[#44403C] capitalize">
                      {rel.relationship_type}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-0.5">{rel.user?.email} · {rel.user?.phone}</p>
                  <div className="flex gap-2 mt-2">
                    {rel.can_view_health && (
                      <span className="text-[10px] font-semibold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded">
                        ✓ Health Vitals Telemetry
                      </span>
                    )}
                    {rel.can_manage_medications && (
                      <span className="text-[10px] font-semibold text-[#9A3412] bg-[#FFEDD5] px-2 py-0.5 rounded">
                        ✓ Prescription Management
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#059669]">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts Priority Chain */}
        <div className="rounded-3xl border border-[#EAE3D8] bg-white p-6 sm:p-7 shadow-xs">
          <h3 className="text-base font-bold text-[#1C1917] font-serif flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-[#DC2626]" />
            Automated Emergency Broadcast Cascade
          </h3>
          <p className="text-xs text-[#78716C] mb-4">
            When an SOS or unacknowledged fall occurs, distress SMS/calls ring in priority order:
          </p>

          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border border-[#EAE3D8] bg-[#FAF8F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#FEE2E2] text-[#991B1B] font-black text-sm flex items-center justify-center shrink-0">
                    {c.priority}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1917]">{c.contact_name}</p>
                    <p className="text-xs text-[#78716C]">{c.relationship} · {c.phone}</p>
                  </div>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-[#047857]"
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
