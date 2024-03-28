import { domainIdValidator } from '#validators/domain_id.validator'
import vine from '@vinejs/vine'

export const createSubjectValidator = vine.object({
  name: vine.string().trim(),
  promotionId: domainIdValidator,
})
