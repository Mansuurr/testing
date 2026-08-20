require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const requestRoutes = require('./routes/request.routes')
const errorMiddleware = require('./middleware/error.middleware')
const serviceRoutes = require('./routes/service.routes')
const pricingRoutes = require('./routes/pricing.routes')
const quizRoutes = require('./routes/quiz.routes')
const calculatorRoutes = require('./routes/calculator.routes')
const settingsRoutes = require('./routes/settings.routes')


const app = express()


app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))


app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много запросов' },
}))


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { message: 'Слишком много попыток, попробуйте через 15 минут' },
})

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

app.use('/api/auth/register', authLimiter)
app.use('/api/auth/login', authLimiter)

// максимум 5 заявок с одного IP за 10 минут
const requestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: 'Слишком много заявок. Попробуйте через 10 минут.' },
})
app.use('/api/requests', requestLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/requests', requestRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/services', serviceRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/calculator', calculatorRoutes)
app.use('/api/settings', settingsRoutes)  
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})