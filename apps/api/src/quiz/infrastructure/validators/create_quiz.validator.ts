import vine from '@vinejs/vine'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  questions: vine.array(createQuestionValidator),
})
