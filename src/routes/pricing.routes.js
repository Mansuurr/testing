const express = require('express')
const router = express.Router()
const pricingController = require('../controllers/pricing.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/', pricingController.getAll)
router.post('/', authMiddleware, adminMiddleware, pricingController.create)
router.put('/:id', authMiddleware, adminMiddleware, pricingController.update)
router.delete('/:id', authMiddleware, adminMiddleware, pricingController.delete)

module.exports = router