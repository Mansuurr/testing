import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function RequestForm({ source = 'direct', type = 'Общая заявка', onSuccess, answers = null }) {
  const [form, setForm] = useState({ name: '', phone: '', messenger: 'telegram' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || sent) return
    setLoading(true)
    setError(null)
    try {
      const payload = { ...form, type, source }
      if (answers) payload.answers = answers
      await api.post('/requests', payload)
      setSent(true)
      onSuccess?.()
    } catch (err) {
      if (err.response?.status === 429) {
        setError(err.response.data?.message || 'Заявка уже отправлена. Мы свяжемся с вами в ближайшее время.')
      } else {
        setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-[#0d1110] p-8 text-center">
        <p className="text-white">Заявка отправлена. Мы скоро свяжемся с вами.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-white/60">Как к вам обращаться</label>
        <input
          required
          value={form.name}
          onChange={handleChange('name')}
          className="w-full rounded-xl border border-white/10 bg-[#101514] px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#79f2bf]"
          placeholder="Иван"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-white/60">Мессенджер для связи</label>
        <div className="flex gap-3">
          {['telegram', 'whatsapp'].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setForm({ ...form, messenger: m })}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-colors ${
                form.messenger === m ? 'border-[#79f2bf] bg-[#79f2bf]/10 text-[#79f2bf]' : 'border-white/10 bg-[#101514] text-white/80'
              }`}
            >
              {m === 'telegram' ? 'Telegram' : 'WhatsApp'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-white/60">Номер телефона</label>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
          className="w-full rounded-xl border border-white/10 bg-[#101514] px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#79f2bf]"
          placeholder="+7 999 000-00-00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#79f2bf] py-4 text-sm font-medium text-[#07110d] transition-transform hover:scale-[1.02] hover:bg-[#98f8cf] disabled:opacity-50"
      >
        {loading ? 'Отправляем...' : 'Оставить заявку'}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
      <p className="text-center text-[11px] text-white/50">Все обращения строго конфиденциальны. Данные не передаются третьим лицам.</p>
    </form>
  )
}