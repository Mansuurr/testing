import { motion } from 'framer-motion'
import { useSettings } from '../hooks/useSettings'

const plans = [
  { name: 'Экспресс', priceKey: 'expressPrice', period: 'до 50 м²', features: ['Визуальный осмотр', 'РЧ сканирование', 'Проверка на камеры'], popular: false },
  { name: 'Стандарт', priceKey: 'standardPrice', period: 'до 100 м²', features: ['Полный TSCM-аудит', 'Акустические каналы', 'Тепловизор', 'Письменное заключение'], popular: true },
  { name: 'Премиум', priceKey: 'premiumPrice', period: 'комплекс', features: ['Всё из Стандарта', 'Проверка авто', 'Анализ сетей', 'NDA', 'Выезд 24/7'], popular: false },
]

export default function Pricing() {
  const { data: settings } = useSettings()

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="relative w-full bg-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
          Тарифы
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-center text-4xl text-[#111] md:text-5xl">
          Стоимость проверки
        </motion.h1>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseMove={handleCardMouseMove}
              className={`spotlight-card relative rounded-2xl border p-8 ${
                plan.popular ? 'border-[#14804f]/40 bg-[#f7f7f5]' : 'border-[#e3e2de] bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#14804f] px-4 py-1 text-xs font-medium text-white">
                  Популярный
                </span>
              )}
              <h3 className="text-lg font-medium text-[#111]">{plan.name}</h3>
              <p className="mt-2 text-3xl font-light text-[#111]">{settings?.[plan.priceKey] ?? '...'}</p>
              <p className="text-sm text-[#888]">{plan.period}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#5c5c58]">
                    <span className="h-1 w-1 rounded-full bg-[#14804f]" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}