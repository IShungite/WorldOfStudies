import { domainIdValidator } from '#validators/domain_id.validator'
import vine from '@vinejs/vine'

export const createPromotionValidator = vine.object({
  name: vine.string().trim(),
  year: vine.number(),
  schoolId: domainIdValidator,
})
