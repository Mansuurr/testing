const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const QUESTIONS = [
  { id: 1, question: 'Конкуренты знают закрытую информацию, которая обсуждалась только внутри компании?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 2, question: 'Замечали проблемы с электроникой авто, посторонние шумы, следы вскрытия или быстрый разряд аккумулятора?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 3, question: 'В последнее время появились новые часы, картины, гаджеты, приборы или другие подарки и сувениры?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 4, question: 'Недавно приходили сторонние службы — ремонт, клининг, обслуживание кондиционеров, пожарной сигнализации, IT-сетей?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 5, question: 'Замечали смещённые элементы потолка, следы возле розеток/плинтусов или перемещённые предметы без объяснения?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 6, question: 'Слышны щелчки, эхо, изменение громкости или посторонний фон в аудиосистемах?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 7, question: 'Были кадровые конфликты или увольнения сотрудников с доступом к критической информации?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 8, question: 'Появлялись неизвестные точки доступа Wi-Fi или подозрительная сетевая активность?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 9, question: 'Замечали подозрительных незнакомцев, автомобили, ремонтные бригады, курьеров или техников рядом с объектом?', options: ['Да', 'Нет'], risk: [1, 0] },
  { id: 10, question: 'Предстоят крупные сделки, суды, проверки, M&A или другие события, при которых утечка критична?', options: ['Да', 'Нет'], risk: [1, 0] },
]

const quizController = {
  getQuestions: asyncHandler(async (req, res) => {
    const safeQuestions = QUESTIONS.map(({ id, question, options }) => ({ id, question, options }))
    res.json(safeQuestions)
  }),

  submit: asyncHandler(async (req, res) => {
    const { email, answers, name, phone } = req.body

  let score = 0
  for (const q of QUESTIONS) {
    const answerIndex = answers[q.id]
    if (answerIndex !== undefined && q.risk[answerIndex] !== undefined) {
      score += q.risk[answerIndex]
    }
  }

  let riskLevel = 'low'
  if (score >= 3) riskLevel = 'high'
  else if (score >= 1) riskLevel = 'medium'

  const RESULTS = {
    high: {
      title: 'Высокий уровень риска',
      text: 'Вердикт инженера: высокая вероятность использования технических средств съёма информации или подготовки канала утечки.',
      warning: 'Не обсуждайте результаты этого теста в подозреваемом помещении.',
      cta: 'Экстренная конфиденциальная консультация инженера',
    },
    medium: {
      title: 'Уязвимый периметр',
      text: 'Обнаружены физические и организационные уязвимости. Рекомендуем провести превентивный TSCM-аудит.',
      warning: null,
      cta: 'Получить план превентивной проверки помещения / авто',
    },
    low: {
      title: 'Базовый уровень',
      text: 'Явных внешних признаков нет, но профессиональные устройства могут не давать заметных симптомов. Рекомендуем плановый инструментальный контроль.',
      warning: null,
      cta: 'Запросить регламент планового аудита безопасности',
    },
  }

  const result = await prisma.quizResult.create({
    data: {
      name: name || null,
      phone: phone || null,
      email: email || null,
      answers: JSON.stringify(answers),
      score,
      riskLevel,
      checklist: JSON.stringify([]),
    },
  })

  res.json({
    score,
    riskLevel,
    ...RESULTS[riskLevel],
    resultId: result.id,
  })
}),

  getResults: asyncHandler(async (req, res) => {
    const results = await prisma.quizResult.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(results)
  }),

  deleteResult: asyncHandler(async (req, res) => {
    const { id } = req.params
    await prisma.quizResult.delete({ where: { id } })
    res.json({ message: 'Удалено' })
  }),
}

module.exports = quizController