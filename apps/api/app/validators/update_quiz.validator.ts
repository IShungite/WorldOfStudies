import { createQuestionValidator } from '#validators/create_question.validator'
import { updateQuestionValidator } from '#validators/update_question.validator'
import vine from '@vinejs/vine'

const questionValidator = vine.union([
  vine.union.if((value) => 'id' in value, updateQuestionValidator),
  vine.union.if((value) => 'id' in value, createQuestionValidator),
])

export const updateQuizValidator = vine.object({
  name: vine.string().trim().optional(),
  questions: vine.array(questionValidator).optional(),
})
