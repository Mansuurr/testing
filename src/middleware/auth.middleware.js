const tokenService = require('../services/token.service')
const prisma = require('../config/db')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Не авторизован' })
    }

    const accessToken = authHeader.split(' ')[1]
    const payload = tokenService.validateAccessToken(accessToken)
    if (!payload) return res.status(401).json({ message: 'Не авторизован' })

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    })
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' })

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Не авторизован' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Нет доступа' })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware }