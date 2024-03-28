import vine from '@vinejs/vine'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { Price } from '#domain/models/shop/price'

const createShopProductValidator = vine.object({
  name: vine.string(),
  price: vine.number().transform((value) => new Price(value)),
})

const createShopCategoryValidator = vine.object({
  name: vine.string(),
  products: vine.array(createShopProductValidator),
})

export const createShopValidator = vine.object({
  schoolId: domainIdValidator,
  categories: vine.array(createShopCategoryValidator),
})
