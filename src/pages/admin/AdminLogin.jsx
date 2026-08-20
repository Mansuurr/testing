import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.user.role !== 'ADMIN') {
        setError('У этого аккаунта нет прав администратора')
        return
      }
      localStorage.setItem('accessToken', data.accessToken)
      navigate('/admin')
    } catch (err) {
      setError('Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center bg-[#050505] px-6">
      <h1 className="mb-8 text-center text-2xl font-light text-white">Вход в админку</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}