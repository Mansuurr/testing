const express = require('express')
const router = express.Router()
const settingsController = require('../controllers/settings.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/', settingsController.get)
router.put('/', authMiddleware, adminMiddleware, settingsController.update)

module.exports = router