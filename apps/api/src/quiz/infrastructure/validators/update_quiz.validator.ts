import vine from '@vinejs/vine'
import { updateQuestionValidator } from '#quiz/infrastructure/validators/update_question.validator'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'

const questionValidator = vine.union([
  vine.union.if((value) => 'id' in value, updateQuestionValidator),
  vine.union.if((value) => !('id' in value), createQuestionValidator),
])

export const updateQuizValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(questionValidator).optional(),
})
