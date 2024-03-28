import { createQuestionValidator } from '#infrastructure/validators/create_question.validator'
import { updateQuestionValidator } from '#infrastructure/validators/update_question.validator'
import vine from '@vinejs/vine'

const questionValidator = vine.union([
  vine.union.if((value) => 'id' in value, updateQuestionValidator),
  vine.union.if((value) => !('id' in value), createQuestionValidator),
])

export const updateQuizValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(questionValidator).optional(),
})
