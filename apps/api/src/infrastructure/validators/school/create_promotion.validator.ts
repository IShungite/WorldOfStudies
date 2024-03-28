import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import vine from '@vinejs/vine'

export const createPromotionValidator = vine.object({
  name: vine.string().trim(),
  year: vine.number(),
  schoolId: domainIdValidator,
})

export const createPromotionsValidator = vine.array(createPromotionValidator)
