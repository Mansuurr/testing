import { motion } from 'framer-motion'
import RequestForm from '../components/RequestForm'

export default function Request() {
  return (
    <div className="relative w-full bg-[#050807] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-6 py-32">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-center text-4xl text-white">
          Заявка на проверку
        </motion.h1>
        <p className="mt-4 text-center text-white/70">Опишите ситуацию — мы свяжемся в течение 10 минут</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12">
          <RequestForm source="direct" type="Общая заявка" />
        </motion.div>
      </div>
    </div>
  )
}