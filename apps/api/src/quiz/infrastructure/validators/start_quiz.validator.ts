import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import vine from '@vinejs/vine'

export const startQuizValidator = vine.object({
  characterId: domainIdValidator,
})
