import vine from '@vinejs/vine'
import { createQuestionValidator } from './create_question_validator.js'

export const updateExerciceValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(createQuestionValidator).optional(),
})
