import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050807] text-white">
      <Header />
      <main className="flex-1 bg-[#050807]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}