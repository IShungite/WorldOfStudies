import vine from '@vinejs/vine'
import { Price } from '#shop/domain/models/price'

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
