import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import api from '../../services/api'

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setStatus('fail')
      return
    }
    api
      .get('/auth/me')
      .then((res) => {
        setStatus(res.data.role === 'ADMIN' ? 'ok' : 'fail')
      })
      .catch(() => setStatus('fail'))
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-sm text-[#555]">
        Проверка доступа...
      </div>
    )
  }
  if (status === 'fail') {
    return <Navigate to="/admin/login" replace />
  }
  return <Outlet />
}