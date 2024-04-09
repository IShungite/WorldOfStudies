import { createQuestionValidator } from './create_question.validator.js'
import vine from '@vinejs/vine'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  questions: vine.array(createQuestionValidator),
})
