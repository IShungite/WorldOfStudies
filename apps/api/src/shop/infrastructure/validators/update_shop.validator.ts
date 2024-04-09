import { Price } from '../../domain/models/price.js'
import vine from '@vinejs/vine'

export const updateShopProductValidator = vine.object({
  name: vine.string().trim().optional(),
  price: vine
    .number()
    .transform((value) => new Price(value))
    .optional(),
})

export const updateShopCategoryValidator = vine.object({
  name: vine.string().trim(),
})
