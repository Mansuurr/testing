const authService = require('../services/auth.service')
const asyncHandler = require('../utils/asyncHandler')

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body, req)
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    res.status(201).json({ user: result.user, accessToken: result.accessToken })
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body, req)
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    res.json({ user: result.user, accessToken: result.accessToken })
  }),

  logout: asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies
    await authService.logout(refreshToken)
    res.clearCookie('refreshToken')
    res.json({ message: 'Выход выполнен' })
  }),

  refresh: asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies
    const result = await authService.refresh(refreshToken, req)
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)
    res.json({ user: result.user, accessToken: result.accessToken })
  }),

  me: asyncHandler(async (req, res) => {
    res.json(req.user)
  }),
}

module.exports = authController