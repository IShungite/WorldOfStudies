import vine from '@vinejs/vine'
import { Price } from '#shop/domain/models/price'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const createShopProductValidator = vine.object({
  itemId: domainIdValidator,
  price: vine.number().transform((value) => new Price(value)),
})

export const createShopCategoryValidator = vine.object({
  name: vine.string(),
  products: vine.array(createShopProductValidator),
})

export const createShopValidator = vine.object({
  schoolId: domainIdValidator,
  categories: vine.array(createShopCategoryValidator),
})
