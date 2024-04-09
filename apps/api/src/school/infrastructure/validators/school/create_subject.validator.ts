import { domainIdValidator } from '../../../../shared/id/infrastructure/validators/domain_id.validator.js'
import vine from '@vinejs/vine'

export const createSubjectValidator = vine.object({
  name: vine.string().trim(),
  promotionId: domainIdValidator,
})
