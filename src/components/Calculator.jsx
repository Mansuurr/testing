import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import api from '../services/api'
import RequestForm from './RequestForm'

export default function Calculator() {
  const [questions, setQuestions] = useState([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [customText, setCustomText] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', messenger: 'telegram' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api.get('/calculator/questions').then(({ data }) => setQuestions(data)).catch(() => {})
  }, [])

  const handleAnswer = (optionIndex, optionText) => {
    const isOther = optionText === 'Другое'
    if (isOther && !showCustomInput) {
      setShowCustomInput(true)
      return
    }

    const q = questions[step]
    const newAnswers = { ...answers, [q.id]: { optionIndex, customText: isOther ? customText : undefined } }
    setAnswers(newAnswers)
    setCustomText('')
    setShowCustomInput(false)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      submitCalculator(newAnswers)
    }
  }

  const submitCalculator = async (finalAnswers) => {
    setLoading(true)
    try {
      await api.post('/calculator/submit', { answers: finalAnswers })
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [formError, setFormError] = useState(null)

  const handleFormChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)
    try {
      await api.post('/requests', {
        name: form.name,
        phone: form.phone,
        messenger: form.messenger,
        type: 'Комплексная проверка (калькулятор)',
        source: 'calculator',
        answers: answers,
      })
      setSent(true)
    } catch (err) {
      if (err.response?.status === 429) {
        setSent(true) // показываем "отправлено" т.к. заявка уже есть
      } else {
        setFormError('Не удалось отправить. Позвоните нам напрямую.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (questions.length === 0) {
    return <p className="text-center text-sm text-white/60">Загрузка...</p>
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0d1110] p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#79f2bf]/15 text-[#79f2bf]">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-white">Заявка отправлена</h3>
        <p className="mt-3 text-sm text-white/70">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    )
  }

if (done) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1110] p-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#79f2bf]/15 text-[#79f2bf]">
        <Check className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-white">Анализ параметров завершен</h3>
      <p className="mb-8 text-sm text-white/70">Смета и состав поисковой группы сформированы.</p>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="rounded-full bg-[#79f2bf] px-6 py-3 text-sm font-medium text-[#07110d]">
          Оставить заявку
        </button>
      ) : (
        <div className="mx-auto mt-2 max-w-[400px] text-left">
          <RequestForm source="calculator" type="Комплексная проверка (калькулятор)" answers={answers} />
        </div>
      )}
    </div>
  )
}
  const q = questions[step]

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1110] p-8 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xs text-white/60">Шаг {step + 1} из {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 w-6 rounded-full ${i <= step ? 'bg-[#79f2bf]' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <h3 className="mb-8 text-lg font-medium leading-relaxed text-white">{q.question}</h3>

          {!showCustomInput ? (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleAnswer(i, opt)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#101514] px-6 py-4 text-left text-sm text-white transition-all hover:border-[#79f2bf] hover:bg-[#79f2bf]/5 disabled:opacity-40"
                >
                  {opt}
                  <ChevronRight className="h-4 w-4 text-white/60" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Уточните вариант..."
                className="w-full rounded-xl border border-white/10 bg-[#101514] px-5 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#79f2bf]"
              />
              <button
                onClick={() => handleAnswer(q.options.length - 1, 'Другое')}
                disabled={!customText.trim()}
                className="w-full rounded-full bg-[#79f2bf] py-3 text-sm font-medium text-[#07110d] disabled:opacity-40"
              >
                Продолжить
              </button>
            </div>
          )}
          {loading && <p className="mt-6 text-center text-xs text-white/60">Формируем результат...</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}