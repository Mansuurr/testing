const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const DEFAULTS = {
  phone: '+7 (999) 000-00-00',
  email: 'info@tscm-group.ru',
  address: 'Москва, ул. Примерная, 1',
  expressPrice: '15 000 ₸',
  standardPrice: '35 000 ₸',
  premiumPrice: '80 000 ₸',
}

const settingsController = {
 
  get: asyncHandler(async (req, res) => {
    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: DEFAULTS })
    }
    res.json(settings)
  }),

 
  update: asyncHandler(async (req, res) => {
    const { phone, email, address, expressPrice, standardPrice, premiumPrice } = req.body

    const fields = { phone, email, address, expressPrice, standardPrice, premiumPrice }
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && (typeof value !== 'string' || value.length > 200)) {
        return res.status(400).json({ message: `Некорректное значение поля ${key}` })
      }
    }

    let settings = await prisma.settings.findFirst()
    if (!settings) {
      settings = await prisma.settings.create({ data: DEFAULTS })
    }

    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: fields,
    })
    res.json(updated)
  }),
}

module.exports = settingsController