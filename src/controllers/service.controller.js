const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const serviceController = {
  getAll: asyncHandler(async (req, res) => {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, slug: true, title: true, shortDesc: true, icon: true, order: true },
    })
    res.json(services)
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params
    const service = await prisma.service.findUnique({ where: { slug } })
    if (!service) {
      const err = new Error('Услуга не найдена')
      err.status = 404
      throw err
    }
    res.json(service)
  }),

  create: asyncHandler(async (req, res) => {
    const service = await prisma.service.create({ data: req.body })
    res.status(201).json(service)
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const service = await prisma.service.update({ where: { id }, data: req.body })
    res.json(service)
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    await prisma.service.delete({ where: { id } })
    res.json({ message: 'Услуга удалена' })
  }),
}

module.exports = serviceController