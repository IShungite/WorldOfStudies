import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const createCharacterValidator = vine.object({
  name: vine.string().trim(),
  promotionId: domainIdValidator,
})
