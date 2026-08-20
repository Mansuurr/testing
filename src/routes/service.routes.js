const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/service.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/', serviceController.getAll)
router.get('/:slug', serviceController.getBySlug)
router.post('/', authMiddleware, adminMiddleware, serviceController.create)
router.put('/:id', authMiddleware, adminMiddleware, serviceController.update)
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.delete)

module.exports = router