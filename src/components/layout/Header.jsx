import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../hooks/useSettings'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { data: settings } = useSettings()
  const phone = settings?.phone || '+7 (999) 000-00-00'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <>
      {/* Тонкая полоса-анонс сверху */}
      <div className="w-full bg-[#1a1a1a] py-1.5 text-center text-[11px] font-medium tracking-wide text-white">
        Работаем по всему Казахстану
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl' : 'border-b border-transparent bg-[#0b0b0b]'
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start">
            <img src="/logo.png" alt="TSCM Group" className="h-20 w-auto md:h-24" />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] font-medium tracking-wide transition-colors ${
                  location.pathname === link.to ? 'text-[#1d9a64]' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-6 md:flex">
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-[13px] text-white/80 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="flex justify-end md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-white/10 bg-[#0b0b0b] md:hidden"
            >
              <div className="flex flex-col gap-6 px-6 py-8">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-lg text-white/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                ))}
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-sm text-white/80">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}