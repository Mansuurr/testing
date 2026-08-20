const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const pricingController = {
  getAll: asyncHandler(async (req, res) => {
    const plans = await prisma.pricing.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    res.json(plans)
  }),

  create: asyncHandler(async (req, res) => {
    const plan = await prisma.pricing.create({ data: req.body })
    res.status(201).json(plan)
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const plan = await prisma.pricing.update({ where: { id }, data: req.body })
    res.json(plan)
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    await prisma.pricing.delete({ where: { id } })
    res.json({ message: 'Тариф удалён' })
  }),
}

module.exports = pricingController