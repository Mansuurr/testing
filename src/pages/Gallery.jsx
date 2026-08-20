import { motion } from 'framer-motion'

const galleryItems = [
  { image: '/1a.jpg', label: 'Saq Group — работа в поле' },
  { image: '/1b.png', label: 'Saq Group — проверка оборудования' },
  { image: '/1c.png', label: 'Saq Group — технический контроль' },
  { image: '/1d.png', label: 'Saq Group — результаты работы' },
]

export default function Gallery() {
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="relative w-full bg-[#050807] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-center text-4xl text-white">
          Галерея
        </motion.h1>
        <p className="mt-4 text-center text-white/70">Фото процесса работы</p>
        <div className="mt-20 grid gap-4 sm:grid-cols-2">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseMove={handleCardMouseMove}
              className="spotlight-card overflow-hidden rounded-2xl border border-white/10 bg-[#0d1110]"
            >
              <img src={item.image} alt={item.label} loading="lazy" className="aspect-video w-full object-cover" />
              <div className="p-6">
                <p className="text-sm text-white/70">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}