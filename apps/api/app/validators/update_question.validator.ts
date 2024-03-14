import { createQuestionValidator } from '#validators/create_question.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import vine from '@vinejs/vine'

export const updateQuestionValidator = vine.object({
  ...createQuestionValidator.getProperties(),
  id: domainIdValidator,
})
