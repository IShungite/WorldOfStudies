import vine from '@vinejs/vine'
import { createQuestionValidator } from './create_question.validator.js'

export const createExerciceValidator = vine.object({
  name: vine.string().trim(),
  questions: vine.array(createQuestionValidator),
})
