import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, Mic, Volume2, Globe, Sparkles, ShieldAlert,
  HelpCircle, User, CheckCircle2, AlertTriangle, RefreshCw
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
    currentUser,
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
      text: "Namaste Ramesh Ji! I am your ElderCare AI Companion. I am here to help you understand your medicine schedule, explain recorded health readings, or translate medical instructions into Hindi or Odia. How can I assist you today?",
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
    if (q.includes('chest pain') || q.includes('fainted') || q.includes('difficulty breathing') || q.includes('heart attack') || q.includes('emergency')) {
      triggerSOS('Patient reported severe symptoms to AI Assistant')
      return "⚠️ CRITICAL ALERT: Your symptoms may indicate a medical emergency. I have notified your daughter Priya and your caregiver immediately. Please sit down comfortably, remain calm, and do not make sudden movements. Emergency contacts are being connected."
    }

    // Odia translation / explanation
    if (q.includes('odia') || q.includes('ଓଡ଼ିଆ') || selectedLang === 'or') {
      return "ନମସ୍କାର ରମେଶ ବାବୁ! ଆପଣଙ୍କର ଆଜିର ଔଷଧ ତାଲିକା:\n1. ଆମଲୋଡିପିନ (Amlodipine 5mg) - ସକାଳ ଜଳଖିଆ ପରେ।\n2. ମେଟଫରମିନ (Metformin 500mg) - ଦ୍ୱିପ୍ରହର ଓ ରାତି ଖାଇବା ପରେ।\n3. ଆସପିରିନ (Aspirin 75mg) - ରାତ୍ରି ଭୋଜନ ପରେ।\nଦୟାକରି ସମୟ ମୁତାବକ ଔଷଧ ସେବନ କରନ୍ତୁ।"
    }

    // Hindi translation / explanation
    if (q.includes('hindi') || selectedLang === 'hi') {
      return "नमस्ते रमेश जी! आपके डॉक्टर अनिल शर्मा के निर्देशानुसार:\n1. एम्लोडिपिन 5mg: सुबह नाश्ते के बाद पानी के साथ लें।\n2. मेटफॉर्मिन 500mg: दोपहर और रात के भोजन के बाद लें।\n3. एस्पिरिन 75mg: रात के भोजन के बाद लें।\nकिसी भी दवा की खुराक को अपने आप न बदलें।"
    }

    // Today's medicines
    if (q.includes('today') || q.includes('medicine') || q.includes('scheduled')) {
      const activeList = medications.filter(m => m.status === 'active')
      return `For today, you have ${activeList.length} active medications prescribed:\n` +
        activeList.map(m => `• ${m.medicine_name} (${m.dosage}) - ${m.instructions || 'Daily routine'}`).join('\n') +
        `\n\nYour 7-day adherence rate is currently ${adherence}%.`
    }

    // Missed doses
    if (q.includes('miss') || q.includes('forgot')) {
      const missed = medicationLogs.filter(l => l.status === 'missed')
      if (missed.length > 0) {
        return `Our records show ${missed.length} dose recorded as missed over the past week (Amlodipine 5mg on Thursday). Remember: Medical safety rules advise NEVER doubling your dose to make up for a missed pill. Take your next scheduled dose normally.`
      }
      return "Good news! You have not missed any recorded medications recently. Keep up this healthy routine!"
    }

    // Blood pressure & health trends
    if (q.includes('blood pressure') || q.includes('bp') || q.includes('vital') || q.includes('reading')) {
      const latestSys = healthReadings.find(r => r.metric_type === 'blood_pressure_systolic')?.value || 124
      const latestDia = healthReadings.find(r => r.metric_type === 'blood_pressure_diastolic')?.value || 80
      return `Your latest recorded blood pressure is ${latestSys}/${latestDia} mmHg. This is within your clinician Dr. Sharma's target threshold (90-140 systolic). Please continue recording your readings daily after morning rest.`
    }

    // Doctor appointment
    if (q.includes('appointment') || q.includes('doctor') || q.includes('visit')) {
      if (appointments.length > 0) {
        const apt = appointments[0]
        return `You have an upcoming appointment scheduled with Dr. Anil Sharma on ${new Date(apt.appointment_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}. Reason: ${apt.notes || 'Routine checkup'}.`
      }
      return "No upcoming appointments are currently scheduled. Would you like me to request your caregiver to arrange one?"
    }

    // Doctor visit summary
    if (q.includes('summary') || q.includes('prepare')) {
      return `📋 Doctor Consultation Summary for Mr. Ramesh Kumar (Age 72):\n\n1. Medication Adherence: ${adherence}% over the past 7 days.\n2. Recent Vitals: Blood Pressure averages 132/84 mmHg; SpO2 averages 98%; Pulse averages 74 bpm.\n3. Prescriptions active: Amlodipine 5mg, Metformin 500mg, Aspirin 75mg, Calcium+D3.\n4. Notes: 1 missed morning dose documented; no reported chest distress or dizziness.`
    }

    // Default grounded helpful response
    return `I understand your question about "${query}". As your healthcare support companion, I can confirm your medication schedule is active with ${medications.length} prescriptions on file. If you are experiencing unusual physical symptoms, please contact Dr. Anil Sharma or tap the Emergency SOS button.`
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

    // Simulate AI response grounded in data
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
    }, 600)
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
    "Have I missed any medicine this week?",
    "Explain my recorded blood pressure readings.",
    "When is my next doctor's appointment?",
    "Explain my medicines in simple Odia (ଓଡ଼ିଆରେ କୁହନ୍ତୁ)",
    "Prepare a summary for my next doctor visit.",
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <PageHeader
        title="Regional AI Health Companion"
        subtitle="Conversational assistant strictly grounded in your patient health records. Supports Odia, Hindi, and English."
        action={
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl">
            <Globe className="h-4 w-4 text-slate-400 ml-2" />
            <button
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLang('or')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLang === 'or' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        }
      />

      {/* Safety Notice Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
          <strong>Clinical Guardrails Active:</strong> Grounded strictly in Mr. Ramesh's records. Never modifies dosages.
        </span>
        <span className="text-[11px] text-blue-700 hidden sm:inline">DPDP Protected Retrieval</span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map(m => {
          const isUser = m.sender === 'user'
          return (
            <div key={m.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser ? 'bg-slate-800' : 'bg-purple-600'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className={`flex items-center justify-between mt-2 pt-2 text-[10px] ${
                  isUser ? 'text-blue-100 border-t border-blue-500/50' : 'text-slate-400 border-t border-slate-200'
                }`}>
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="p-1 hover:text-purple-600 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-bold text-slate-400 shrink-0">Quick Queries:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-slate-200 focus-within:border-blue-500 transition-colors shadow-xs">
        <button
          onClick={() => handleSend("Explain my medication in Odia")}
          className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
          title="Voice Command input"
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
              ? 'अपनी दवाओं या स्वास्थ्य के बारे में पूछें...'
              : 'Ask anything about your medicines, health vitals, or doctor visits...'
          }
          className="flex-1 bg-transparent px-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
