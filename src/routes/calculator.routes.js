const express = require('express')
const router = express.Router()
const calculatorController = require('../controllers/calculator.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/questions', calculatorController.getQuestions)
router.post('/submit', calculatorController.submit)
router.get('/results', authMiddleware, adminMiddleware, calculatorController.getResults)

module.exports = router