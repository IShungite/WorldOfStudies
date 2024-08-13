import vine from '@vinejs/vine'
import { Price } from '#shop/domain/models/price'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const updateShopProductValidator = vine.object({
  itemId: domainIdValidator.optional(),
  price: vine
    .number()
    .transform((value) => new Price(value))
    .optional(),
})

export const updateShopCategoryValidator = vine.object({
  name: vine.string().trim(),
})
