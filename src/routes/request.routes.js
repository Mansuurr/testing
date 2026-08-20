const express = require('express')
const router = express.Router()
const requestController = require('../controllers/request.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.post('/', requestController.create)
router.get('/', authMiddleware, adminMiddleware, requestController.getAll)
router.get('/:id', authMiddleware, adminMiddleware, requestController.getById)
router.put('/:id', authMiddleware, adminMiddleware, requestController.update)
router.delete('/:id', authMiddleware, adminMiddleware, requestController.delete)

module.exports = router