import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const promotionEntitiesToPromotionValidator = vine.object({
  data: vine.array(
    vine.object({
      id: domainIdValidator,
      name: vine.string().trim(),
      year: vine.number(),
      subjects: vine.array(
        vine.object({
          id: domainIdValidator,
          name: vine.string().trim(),
        })
      ),
    })
  ),
})
