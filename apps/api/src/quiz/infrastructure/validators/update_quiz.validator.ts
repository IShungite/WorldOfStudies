import { createQuestionValidator } from './create_question.validator.js'
import { updateQuestionValidator } from './update_question.validator.js'
import vine from '@vinejs/vine'

const questionValidator = vine.union([
  vine.union.if((value) => 'id' in value, updateQuestionValidator),
  vine.union.if((value) => !('id' in value), createQuestionValidator),
])

export const updateQuizValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(questionValidator).optional(),
})
