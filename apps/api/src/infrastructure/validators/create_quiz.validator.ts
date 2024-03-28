import { createQuestionValidator } from '#infrastructure/validators/create_question.validator'
import vine from '@vinejs/vine'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  questions: vine.array(createQuestionValidator),
})
