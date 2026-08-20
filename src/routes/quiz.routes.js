const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quiz.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get('/questions', quizController.getQuestions)
router.post('/submit', quizController.submit)
router.get('/results', authMiddleware, adminMiddleware, quizController.getResults)
router.delete('/results/:id', authMiddleware, adminMiddleware, quizController.deleteResult)

module.exports = router