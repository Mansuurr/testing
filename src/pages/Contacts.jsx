import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Contacts() {
  return (
    <div className="relative w-full bg-[#050807] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-32">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-center text-4xl text-white">
          Контакты
        </motion.h1>
        <div className="mt-20 space-y-8">
          {[
            { icon: Phone, label: 'Телефон', value: '+7 (XXX) XXX-XX-XX' },
            { icon: Mail, label: 'Email', value: 'info@tscm-group.ru' },
            { icon: MapPin, label: 'Адрес', value: 'Москва, ул. Примерная, 1' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 rounded-2xl border border-white/10 bg-[#0d1110] p-6"
            >
              <item.icon className="h-5 w-5 text-[#79f2bf]" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">{item.label}</p>
                <p className="mt-1 text-lg text-white">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}