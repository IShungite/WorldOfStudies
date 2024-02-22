import { createQuestionValidator } from '#validators/create_question.validator'
import vine from '@vinejs/vine'

export const updateExerciceValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(createQuestionValidator).optional(),
})
