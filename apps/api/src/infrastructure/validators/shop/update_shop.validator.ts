import { Price } from '#domain/models/shop/price'
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
