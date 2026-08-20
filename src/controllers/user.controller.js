const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')
const bcrypt = require('bcryptjs')

const userController = {
  create: asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body

    if (!email || !password) {
      const err = new Error('Email и пароль обязательны')
      err.status = 400
      throw err
    }
    if (password.length < 6) {
      const err = new Error('Пароль должен быть не короче 6 символов')
      err.status = 400
      throw err
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      const err = new Error('Пользователь с таким email уже существует')
      err.status = 400
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    res.status(201).json(user)
  }),

  getAll: asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    })
    if (!user) {
      const err = new Error('Пользователь не найден')
      err.status = 404
      throw err
    }
    res.json(user)
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, email, role } = req.body

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      const err = new Error('Нет доступа')
      err.status = 403
      throw err
    }

    const data = {}
    if (name) data.name = name
    if (email) data.email = email
    if (role && req.user.role === 'ADMIN') data.role = role

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, updatedAt: true },
    })
    res.json(user)
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    await prisma.user.delete({ where: { id } })
    res.json({ message: 'Пользователь удалён' })
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body

    if (req.user.id !== id) {
      const err = new Error('Нет доступа')
      err.status = 403
      throw err
    }

    const user = await prisma.user.findUnique({ where: { id } })
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      const err = new Error('Неверный старый пароль')
      err.status = 400
      throw err
    }


    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id }, data: { password: hashedPassword } })
    res.json({ message: 'Пароль изменён' })
  }),
}

module.exports = userController