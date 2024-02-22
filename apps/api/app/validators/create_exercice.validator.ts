import { createQuestionValidator } from '#validators/create_question.validator'
import vine from '@vinejs/vine'

export const createExerciceValidator = vine.object({
  name: vine.string().trim(),
  questions: vine.array(createQuestionValidator),
})
