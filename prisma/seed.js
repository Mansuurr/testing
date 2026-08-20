const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {

  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@tscm.com' } })
  if (!adminExists) {
    await prisma.user.create({
      data: {
        email: 'admin@tscm.com',
        password: await bcrypt.hash('admin12345', 12),
        name: 'Admin',
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin created: admin@tscm.com / admin12345')
  }

  const servicesCount = await prisma.service.count()
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          slug: 'tscm',
          title: 'Поиск прослушивающих устройств (TSCM)',
          shortDesc: 'Поиск скрытых радиомикрофонов, GSM-жучков, проводных микрофонов и скрытых камер.',
          fullDesc: 'Профессиональное обследование помещений с использованием многоканальных анализаторов спектра и нелинейных локаторов. Выявляем аналоговые и цифровые жучки любого типа.',
          icon: 'radio',
          order: 1,
        },
        {
          slug: 'car',
          title: 'Проверка автомобилей на слежку',
          shortDesc: 'Обнаружение GPS-трекеров, маячков слежения, скрытых камер в салоне и под кузовом.',
          fullDesc: 'Комплексная проверка транспортного средства на наличие закладных устройств. Используем детекторы полей, тепловизоры и эндоскопы для осмотра труднодоступных мест.',
          icon: 'car',
          order: 2,
        },
        {
          slug: 'room',
          title: 'Обследование помещений и переговорных',
          shortDesc: 'Детальный поиск каналов утечки акустической и визуальной информации.',
          fullDesc: 'Проверка офисов, квартир, переговорных комнат перед важными встречами или на постоянной основе. Выявляем все каналы утечки: радио, акустические, оптические, питающие сети.',
          icon: 'building',
          order: 3,
        },
        {
          slug: 'camera',
          title: 'Выявление скрытых видеокамер',
          shortDesc: 'Поиск микрокамер, включая пинхол-объективы, замаскированных под элементы интерьера.',
          fullDesc: 'Специализированный поиск видеокамер с использованием оптических детекторов, ИД-излучателей и тепловизоров. Находим камеры в режиме записи и ожидания.',
          icon: 'video',
          order: 4,
        },
        {
          slug: 'audit',
          title: 'Антишпионский аудит и консалтинг',
          shortDesc: 'Оценка защищённости пространства и разработка мер противодействия съёму информации.',
          fullDesc: 'Комплексный аудит безопасности с выдачей заключения и рекомендаций. Разрабатываем систему защиты информации под ваши задачи и бюджет.',
          icon: 'clipboard-check',
          order: 5,
        },
      ],
    })
    console.log('✅ Services seeded')
  }


  const pricingCount = await prisma.pricing.count()
  if (pricingCount === 0) {
    await prisma.pricing.createMany({
      data: [
        {
          name: 'Экспресс-проверка',
          price: '15 000 ₽',
          period: 'за помещение до 50 м²',
          features: 'Визуальный осмотр, радиочастотное сканирование, проверка на скрытые камеры',
          order: 1,
        },
        {
          name: 'Стандарт',
          price: '35 000 ₽',
          period: 'за объект до 100 м²',
          features: 'Полный TSCM-аудит, проверка акустических каналов, тепловизионный осмотр, письменное заключение',
          popular: true,
          order: 2,
        },
        {
          name: 'Премиум',
          price: '80 000 ₽',
          period: 'за комплексный объект',
          features: 'Всё из Стандарта + проверка автомобиля, анализ сетей, мониторинг 24ч, NDA, выезд в любое время',
          order: 3,
        },
      ],
    })
    console.log('✅ Pricing seeded')
  }

  console.log('🌱 Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })