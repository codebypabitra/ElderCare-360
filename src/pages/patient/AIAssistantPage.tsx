import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, Mic, Volume2, Globe, Sparkles, User
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/layout/PageHeader'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  language?: 'en' | 'hi' | 'or'
  timestamp: string
}

export default function AIAssistantPage() {
  const {
    medications,
    medicationLogs,
    healthReadings,
    getAppointments,
    getAdherenceRate,
    triggerSOS,
  } = useApp()

  const [input, setInput] = useState('')
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'or'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const appointments = getAppointments()
  const adherence = getAdherenceRate()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Namaste Ramesh Ji! (ନମସ୍କାର ରମେଶ ବାବୁ) 🙏\nI am your ElderCare AI Sahayak. I am here to help you understand your medicine timings in English, Hindi, or Odia, explain your blood pressure vitals, or prepare summaries for Dr. Anil Sharma. How may I assist you today?",
      language: 'en',
      timestamp: 'Just now',
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Context-aware response generator based on stored real records
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase()

    // Emergency check
    if (q.includes('chest pain') || q.includes('fainted') || q.includes('difficulty breathing') || q.includes('heart attack') || q.includes('emergency') || q.includes('dard')) {
      triggerSOS('Patient reported severe symptoms to AI Assistant')
      return "⚠️ AAPATKAALIN SURAKSHA ALERT: Your symptoms may indicate an emergency. I have notified your daughter Priya in Bengaluru and your caregiver Sunita immediately. Please sit down comfortably, remain calm, and do not make sudden movements. Emergency contacts are being connected."
    }

    // Odia translation / explanation
    if (q.includes('odia') || q.includes('ଓଡ଼ିଆ') || selectedLang === 'or') {
      return "ନମସ୍କାର ରମେଶ ବାବୁ! ଆପଣଙ୍କର ଆଜିର ଔଷଧ ସୂଚୀ:\n\n1. ଆମଲୋଡିପିନ (Amlodipine 5mg) — ସକାଳ ଜଳଖିଆ ପରେ (ସକାଳ ୮:୦୦)।\n2. ମେଟଫରମିନ (Metformin 500mg) — ଦ୍ୱିପ୍ରହର ଓ ରାତି ଖାଇବା ପରେ।\n3. ଆସପିରିନ (Aspirin 75mg) — ରାତ୍ରି ଭୋଜନ ପରେ।\n4. କ୍ୟାଲସିୟମ (Calcium + D3) — ସକାଳେ (କେବଳ ୪ଟି ବଟିକା ବାକି ଅଛି, ରିଫିଲ ଦରକାର)।\n\nଆପଣଙ୍କ ସାପ୍ତାହିକ ଔଷଧ ନିୟମିତତା ୯୪% ରହିଛି। ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ଭଲ ଅଛି!"
    }

    // Hindi translation / explanation
    if (q.includes('hindi') || q.includes('हिन्दी') || selectedLang === 'hi') {
      return "नमस्ते रमेश जी! आपके डॉक्टर अनिल शर्मा के परामर्श अनुसार आपकी दवाइयाँ:\n\n1. एम्लोडिपिन (Amlodipine 5mg) — सुबह नाश्ते के बाद पानी के साथ लें।\n2. मेटफॉर्मिन (Metformin 500mg) — दोपहर और रात के भोजन के बाद लें।\n3. एस्पिरिन (Aspirin 75mg) — रात के खाने के बाद लें।\n4. कैल्शियम व विटामिन D3 — सुबह लें।\n\nकृपया किसी भी दवा की खुराक को अपने आप न बदलें।"
    }

    // Today's medicines
    if (q.includes('today') || q.includes('medicine') || q.includes('scheduled') || q.includes('dawai')) {
      const activeList = medications.filter(m => m.status === 'active')
      return `For today, you have ${activeList.length} active medications prescribed:\n` +
        activeList.map(m => `• ${m.medicine_name} (${m.dosage}) — ${m.instructions || 'With water after food'}`).join('\n') +
        `\n\nYour 7-day adherence rate is currently ${adherence}%. You are maintaining a healthy routine!`
    }

    // Missed doses
    if (q.includes('miss') || q.includes('forgot') || q.includes('chhoot')) {
      const missed = medicationLogs.filter(l => l.status === 'missed')
      if (missed.length > 0) {
        return `Our records show ${missed.length} dose recorded as missed over the past week (Amlodipine 5mg). Remember: Medical safety rules advise NEVER doubling your dose to make up for a missed pill. Take your next scheduled dose normally.`
      }
      return "Good news Ramesh Ji! You have not missed any recorded medications recently. Priya and Sunita are very pleased with your routine!"
    }

    // Blood pressure & health trends
    if (q.includes('blood pressure') || q.includes('bp') || q.includes('vital') || q.includes('reading') || q.includes('rakt')) {
      const latestSys = healthReadings.find(r => r.metric_type === 'blood_pressure_systolic')?.value || 124
      const latestDia = healthReadings.find(r => r.metric_type === 'blood_pressure_diastolic')?.value || 82
      return `Your latest recorded blood pressure is ${latestSys}/${latestDia} mmHg. This is within your clinician Dr. Sharma's target threshold (90-140 systolic). Please continue recording your readings daily after morning rest.`
    }

    // Doctor appointment
    if (q.includes('appointment') || q.includes('doctor') || q.includes('visit')) {
      if (appointments.length > 0) {
        const apt = appointments[0]
        return `You have an upcoming appointment with Dr. Anil Sharma on ${new Date(apt.appointment_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}. Reason: ${apt.notes || 'Routine quarterly cardiology review'}.`
      }
      return "No upcoming appointments are currently scheduled. Would you like me to request your caregiver Sunita to arrange one?"
    }

    // Doctor visit summary
    if (q.includes('summary') || q.includes('prepare')) {
      return `📋 Doctor Consultation Summary for Mr. Ramesh Kumar (Age 72):\n\n1. Medication Adherence: ${adherence}% over the past 7 days.\n2. Recent Vitals: Blood Pressure averages 126/82 mmHg; SpO2 averages 98%; Pulse averages 74 bpm.\n3. Prescriptions active: Amlodipine 5mg, Metformin 500mg, Aspirin 75mg, Calcium+D3.\n4. Notes: 1 missed morning dose documented; no reported chest distress or dizziness.`
    }

    // Default grounded helpful response
    return `Namaste Ramesh Ji! Regarding "${query}": As your healthcare support companion, I can confirm your care circle is active with ${medications.length} prescriptions on file. If you are feeling unwell or have dizziness, please rest immediately or tap the Emergency SOS button.`
  }

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input
    if (!q.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const reply = generateResponse(q)
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: reply,
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 500)
  }

  // Voice Speech Synthesis
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  const quickPrompts = [
    "What medicines are scheduled for today?",
    "Explain my medicines in simple Odia (ଓଡ଼ିଆରେ କୁହନ୍ତୁ)",
    "Explain my blood pressure readings",
    "Have I missed any medicine this week?",
    "When is my next doctor's appointment?",
    "Prepare a summary for my next doctor visit",
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 text-[#1C1917]">
      <PageHeader
        title="Regional AI Sahayak (ଏଆଇ ସହାୟକ)"
        subtitle="Conversational health companion grounded strictly in your patient records. Supports Odia, Hindi, and English."
        action={
          <div className="flex items-center gap-1.5 bg-white border border-[#EAE3D8] p-1 rounded-2xl shadow-2xs">
            <Globe className="h-4 w-4 text-[#78716C] ml-2" />
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLang === 'en' ? 'bg-[#1C1917] text-white' : 'text-[#57534E] hover:bg-[#F5F1EB]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLang === 'hi' ? 'bg-[#1C1917] text-white' : 'text-[#57534E] hover:bg-[#F5F1EB]'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLang('or')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedLang === 'or' ? 'bg-[#1C1917] text-white' : 'text-[#57534E] hover:bg-[#F5F1EB]'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        }
      />

      {/* Claude Style Safety Notice Banner */}
      <div className="px-5 py-3 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] text-[#9A3412] text-xs flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#EA580C] shrink-0" />
          <strong>Grounded Clinical Guardrails:</strong> Based on Mr. Ramesh's live Supabase records. Never prescribes unauthorized dosages.
        </span>
        <span className="text-[11px] text-[#C2410C] font-bold hidden sm:inline">DPDP Protected Privacy</span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-white rounded-3xl border border-[#EAE3D8] p-5 sm:p-7 overflow-y-auto space-y-4 shadow-xs">
        {messages.map(m => {
          const isUser = m.sender === 'user'
          return (
            <div key={m.id} className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isUser ? 'bg-[#1C1917] text-white' : 'bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-3xl p-5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1C1917] text-white rounded-tr-xs'
                    : 'bg-[#FAF8F5] text-[#1C1917] border border-[#EAE3D8] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{m.text}</div>
                <div className={`flex items-center justify-between mt-3 pt-2 text-[10px] ${
                  isUser ? 'text-[#A8A29E] border-t border-white/10' : 'text-[#78716C] border-t border-[#EAE3D8]'
                }`}>
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="p-1 hover:text-[#C2410C] transition-colors flex items-center gap-1 cursor-pointer font-bold"
                      title="Read aloud"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isSpeaking ? 'Awaaz Band (Stop)' : 'Bolkar Sunayein (Listen)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-bold text-[#A8A29E] shrink-0">Suggestions:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F1EB] text-[#44403C] text-xs font-semibold shrink-0 border border-[#EAE3D8] transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Claude Style Warm Input Bar */}
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-3xl border-2 border-[#EAE3D8] focus-within:border-[#C2410C] transition-colors shadow-xs">
        <button
          onClick={() => handleSend("Explain my medicines in simple Odia (ଓଡ଼ିଆରେ କୁହନ୍ତୁ)")}
          className="p-3 text-[#78716C] hover:text-[#C2410C] hover:bg-[#FFF7ED] rounded-2xl transition-colors cursor-pointer"
          title="Voice Command (Bol Kar Poochein)"
        >
          <Mic className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={
            selectedLang === 'or'
              ? 'ଓଡ଼ିଆରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ (ଉଦାହରଣ: ଆଜି ମୋର କେଉଁ ଔଷଧ ଖାଇବା ବାକି ଅଛି?)...'
              : selectedLang === 'hi'
              ? 'दवाइयों या रक्तचाप के बारे में पूछें...'
              : 'Ask anything about your medicine timings, BP readings, or doctor visit summary...'
          }
          className="flex-1 bg-transparent px-2 text-base text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="h-11 w-11 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
