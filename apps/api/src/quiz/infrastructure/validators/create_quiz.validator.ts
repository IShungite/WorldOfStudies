import vine from '@vinejs/vine'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  subjectId: domainIdValidator,
  questions: vine.array(createQuestionValidator),
})
