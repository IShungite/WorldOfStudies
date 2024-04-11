import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const createSubjectValidator = vine.object({
  name: vine.string().trim(),
  promotionId: domainIdValidator,
})
