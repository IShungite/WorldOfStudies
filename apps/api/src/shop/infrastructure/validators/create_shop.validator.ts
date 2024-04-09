import vine from '@vinejs/vine'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
import { Price } from '../../domain/models/price.js'

export const createShopProductValidator = vine.object({
  name: vine.string(),
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
