const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const requestController = {
  getAll: asyncHandler(async (req, res) => {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(requests)
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const request = await prisma.request.findUnique({ where: { id } })
    if (!request) {
      const err = new Error('Заявка не найдена')
      err.status = 404
      throw err
    }
    res.json(request)
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const request = await prisma.request.update({
      where: { id },
      data: { status },
    })
    res.json(request)
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    await prisma.request.delete({ where: { id } })
    res.json({ message: 'Заявка удалена' })
  }),

  create: asyncHandler(async (req, res) => {
    const { name, phone, type, description, messenger, source, answers } = req.body

    // блокируем повторную заявку с того же номера в течение 10 минут
    const recentDuplicate = await prisma.request.findFirst({
      where: {
        phone,
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (recentDuplicate) {
      return res.status(429).json({ message: 'Заявка уже отправлена. Мы свяжемся с вами в ближайшее время.' })
    }

    const request = await prisma.request.create({
      data: {
        name,
        phone,
        type,
        description,
        messenger: messenger || 'phone',
        source: source || 'direct',
        answers: answers ? JSON.stringify(answers) : null,
      },
    })
    res.status(201).json(request)
  }),
}

module.exports = requestController