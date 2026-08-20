const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const CALC_QUESTIONS = [
  {
    id: 1,
    key: 'object',
    question: 'Что именно требует проверки и защиты в первую очередь?',
    options: [
      'Главный офис / переговорные зоны / кабинет генерального директора',
      'Личный автотранспорт / корпоративный автопарк',
      'Частная резиденция / квартира / коттедж',
      'Комплексно: помещение + автотранспорт + IT-инфраструктура',
      'Другое',
    ],
  },
  {
    id: 2,
    key: 'scale',
    question: 'Какова общая площадь помещения или класс автотранспорта?',
    options: ['До 100 м²', '100–300 м²', '300–1 000 м²', 'Более 1 000 м²', 'Другое'],
  },
  {
    id: 3,
    key: 'reason',
    question: 'Что послужило поводом для обращения?',
    options: [
      'Есть конкретные подозрения / произошла утечка информации',
      'Предстоят важные переговоры / сделка / M&A',
      'Кадровые или структурные изменения',
      'Плановый контроль безопасности',
      'Другое',
    ],
  },
  {
    id: 4,
    key: 'schedule',
    question: 'Какой формат и график проведения работ вам подходит?',
    options: ['Экстренный выезд — в течение 2 часов', 'Ночной выезд / выходной день', 'В рабочее время', 'Другое'],
  },
  {
    id: 5,
    key: 'digital',
    question: 'Требуется ли дополнительная проверка цифрового периметра?',
    options: [
      'Да — аудит Wi-Fi, серверов и поиск шпионского ПО',
      'Да — оценка акустической защиты',
      'Нет — только физический и радиоэлектронный поиск закладок (TSCM)',
      'Нужна консультация эксперта',
      'Другое',
    ],
  },
]

const calculatorController = {
  getQuestions: asyncHandler(async (req, res) => {
    res.json(CALC_QUESTIONS)
  }),

  submit: asyncHandler(async (req, res) => {
    const { answers } = req.body

    const objectAnswer = answers[1]
    const objectType = objectAnswer?.customText || CALC_QUESTIONS[0].options[objectAnswer?.optionIndex] || 'Не указано'

    const result = await prisma.calculatorResult.create({
      data: {
        answers: JSON.stringify(answers),
        objectType,
      },
    })

    res.json({
      message: 'Анализ параметров завершен. Смета и состав поисковой группы сформированы.',
      resultId: result.id,
    })
  }),

  getResults: asyncHandler(async (req, res) => {
    const results = await prisma.calculatorResult.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(results)
  }),
}

module.exports = calculatorController