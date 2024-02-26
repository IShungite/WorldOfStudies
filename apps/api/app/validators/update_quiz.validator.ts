import { createQuestionValidator } from '#validators/create_question.validator'
import vine from '@vinejs/vine'

export const updateQuizValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(createQuestionValidator).optional(),
})
