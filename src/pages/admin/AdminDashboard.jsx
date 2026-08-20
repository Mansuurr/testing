import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const TABS = [
  { id: 'requests', label: 'Заявки' },
  { id: 'quiz', label: 'Результаты теста' },
  { id: 'settings', label: 'Настройки сайта' },
  { id: 'users', label: 'Пользователи' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('requests')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
    
    }
    localStorage.removeItem('accessToken')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-light">Админ-панель</h1>
          <button onClick={handleLogout} className="rounded-full border border-[#333] px-4 py-2 text-sm text-[#888] transition-colors hover:text-white">
            Выйти
          </button>
        </div>

        <div className="mb-8 flex gap-2 border-b border-[#1f1f1f]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm transition-colors ${
                tab === t.id ? 'border-b-2 border-white text-white' : 'text-[#666] hover:text-[#aaa]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'requests' && <RequestsTab />}
        {tab === 'quiz' && <QuizTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </div>
  )
}

function RequestsTab() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => (await api.get('/requests')).data,
  })
  const { data: calcQuestions } = useQuery({
    queryKey: ['calc-questions-admin'],
    queryFn: async () => (await api.get('/calculator/questions')).data,
  })
  const { data: quizQuestions } = useQuery({
    queryKey: ['quiz-questions-admin'],
    queryFn: async () => (await api.get('/quiz/questions')).data,
  })
  const [openId, setOpenId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/requests/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-requests'] }),
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!confirm('Удалить заявку?')) return
    setDeletingId(id)
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  if (isLoading) return <p className="text-sm text-[#555]">Загрузка...</p>
  if (!data?.length) return <p className="text-sm text-[#555]">Заявок пока нет</p>

  const messengerLabel = (m) => (m === 'telegram' ? 'Telegram' : m === 'whatsapp' ? 'WhatsApp' : 'Звонок')
  const sourceLabel = (s) => (s === 'calculator' ? 'Калькулятор' : s === 'quiz' ? 'Тест' : 'Напрямую')

  const parseAnswers = (raw) => {
    try { return JSON.parse(raw) } catch { return null }
  }

  return (
    <div className="space-y-3">
      {data.map((r) => {
        const answers = r.answers ? parseAnswers(r.answers) : null
        const isOpen = openId === r.id

        return (
          <div key={r.id} className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-5">
            <button onClick={() => setOpenId(isOpen ? null : r.id)} className="flex w-full items-start justify-between text-left">
              <div>
                <p className="font-medium">{r.name} · {r.phone}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="rounded-full bg-[#1a1a1a] px-2.5 py-0.5 text-xs text-[#4a9490]">
                    {messengerLabel(r.messenger)}
                  </span>
                  <span className="text-xs text-[#666]">{sourceLabel(r.source)}</span>
                  <span className="text-xs text-[#666]">· {r.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#666]">{new Date(r.createdAt).toLocaleString('ru-RU')}</span>
                <button
                  onClick={(e) => handleDelete(e, r.id)}
                  disabled={deletingId === r.id}
                  className="rounded px-2 py-1 text-xs text-[#555] transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-40"
                >
                  {deletingId === r.id ? '...' : '✕'}
                </button>
              </div>
            </button>

            {r.description && <p className="mt-2 text-sm text-[#aaa]">{r.description}</p>}

            {isOpen && r.source === 'quiz' && answers && (
              <div className="mt-4 space-y-2 border-t border-[#1f1f1f] pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-[#555]">Ответы теста безопасности</p>
                {quizQuestions ? (
                  quizQuestions.map((q) => {
                    const answerIndex = answers[q.id]
                    const answerText = q.options[answerIndex] || '—'
                    return (
                      <div key={q.id} className="text-sm">
                        <p className="text-[#aaa]">{q.question}</p>
                        <p className="mt-0.5 font-medium text-white">{answerText}</p>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-[#666]">Загрузка вопросов...</p>
                )}
              </div>
            )}

            {isOpen && r.source === 'calculator' && answers && (
              <div className="mt-4 space-y-2 border-t border-[#1f1f1f] pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-[#555]">Ответы предварительного аудита</p>
                {calcQuestions ? (
                  calcQuestions.map((q) => {
                    const a = answers[q.id]
                    const answerText = a?.customText || q.options[a?.optionIndex] || '—'
                    return (
                      <div key={q.id} className="text-sm">
                        <p className="text-[#aaa]">{q.question}</p>
                        <p className="mt-0.5 font-medium text-white">{answerText}</p>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-[#666]">Загрузка вопросов...</p>
                )}
              </div>
            )}

            {isOpen && !answers && (
              <div className="mt-4 border-t border-[#1f1f1f] pt-4">
                <p className="text-xs text-[#666]">Дополнительные ответы отсутствуют</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SettingsTab() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.get('/settings')).data,
  })
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: async (payload) => (await api.put('/settings', payload)).data,
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings'], updated)
      setForm(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  const current = form || data

  if (isLoading || !current) return <p className="text-sm text-[#555]">Загрузка...</p>

  const handleChange = (field) => (e) => {
    setForm({ ...current, [field]: e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault()
    mutation.mutate(current)
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-8">
      <div>
        <h3 className="mb-3 text-xs uppercase tracking-wider text-[#555]">Контакты</h3>
        <div className="space-y-3">
          <Field label="Телефон" value={current.phone} onChange={handleChange('phone')} />
          <Field label="Email" value={current.email} onChange={handleChange('email')} />
          <Field label="Адрес" value={current.address} onChange={handleChange('address')} />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xs uppercase tracking-wider text-[#555]">Цены тарифов</h3>
        <div className="space-y-3">
          <Field label="Экспресс" value={current.expressPrice} onChange={handleChange('expressPrice')} />
          <Field label="Стандарт" value={current.standardPrice} onChange={handleChange('standardPrice')} />
          <Field label="Премиум" value={current.premiumPrice} onChange={handleChange('premiumPrice')} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {mutation.isPending ? 'Сохраняем...' : 'Сохранить'}
        </button>
        {saved && <p className="text-sm text-[#4a9490]">Сохранено</p>}
        {mutation.isError && <p className="text-sm text-red-400">Ошибка сохранения</p>}
      </div>
    </form>
  )
}

function UsersTab() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'USER' })
  const [message, setMessage] = useState(null)

  const mutation = useMutation({
    mutationFn: async (payload) => (await api.post('/users', payload)).data,
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Пользователь создан' })
      setForm({ email: '', password: '', name: '', role: 'USER' })
    },
    onError: (err) => {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка создания' })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage(null)
    mutation.mutate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h3 className="mb-3 text-xs uppercase tracking-wider text-[#555]">Создать пользователя</h3>
      <Field
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        type="email"
      />
      <Field
        label="Пароль"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        type="password"
      />
      <Field
        label="Имя (необязательно)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <div>
        <label className="mb-1 block text-xs text-[#555]">Роль</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#444]"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {mutation.isPending ? 'Создание...' : 'Создать'}
        </button>
        {message && (
          <p className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-[#4a9490]'}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-[#555]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#444]"
      />
    </div>
  )
}

function QuizTab() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-quiz'],
    queryFn: async () => (await api.get('/quiz/results')).data,
  })
  const { data: questions } = useQuery({
    queryKey: ['quiz-questions-admin'],
    queryFn: async () => (await api.get('/quiz/questions')).data,
  })
  const [openId, setOpenId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/quiz/results/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-quiz'] }),
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (!confirm('Удалить результат?')) return
    setDeletingId(id)
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  if (isLoading) return <p className="text-sm text-[#555]">Загрузка...</p>
  if (!data?.length) return <p className="text-sm text-[#555]">Результатов пока нет</p>

  const riskLabel = (level) => (level === 'high' ? '🔴 Высокий' : level === 'medium' ? '🟠 Средний' : '🟢 Базовый')

  const parseAnswers = (raw) => {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-3">
      {data.map((r) => {
        const answers = parseAnswers(r.answers)
        const isOpen = openId === r.id

        return (
          <div key={r.id} className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-5">
            <button onClick={() => setOpenId(isOpen ? null : r.id)} className="flex w-full items-center justify-between text-left">
              <div>
                <p className="font-medium">
                  {r.name || 'Аноним'} {r.phone ? `· ${r.phone}` : ''}
                </p>
                <p className="mt-1 text-sm text-[#888]">{riskLabel(r.riskLevel)} · Балл: {r.score}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#666]">{new Date(r.createdAt).toLocaleString('ru-RU')}</span>
                <button
                  onClick={(e) => handleDelete(e, r.id)}
                  disabled={deletingId === r.id}
                  className="rounded px-2 py-1 text-xs text-[#555] transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-40"
                >
                  {deletingId === r.id ? '...' : '✕'}
                </button>
              </div>
            </button>

            {isOpen && (
              <div className="mt-4 space-y-2 border-t border-[#1f1f1f] pt-4">
                {questions?.map((q) => {
                  const answerIndex = answers[q.id]
                  const answerText = answerIndex !== undefined ? q.options[answerIndex] : '—'
                  return (
                    <div key={q.id} className="text-sm">
                      <p className="text-[#aaa]">{q.question}</p>
                      <p className={`mt-0.5 font-medium ${answerText === 'Да' ? 'text-red-400' : 'text-[#4a9490]'}`}>{answerText}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}