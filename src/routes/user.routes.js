const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.post('/', authMiddleware, adminMiddleware, userController.create)
router.get('/', authMiddleware, adminMiddleware, userController.getAll)
router.get('/:id', authMiddleware, userController.getById)
router.put('/:id', authMiddleware, userController.update)
router.delete('/:id', authMiddleware, adminMiddleware, userController.delete)
router.post('/:id/change-password', authMiddleware, userController.changePassword)

module.exports = router