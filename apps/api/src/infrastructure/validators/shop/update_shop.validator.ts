import vine from '@vinejs/vine'

export const updateShopCategoryValidator = vine.object({
  name: vine.string().trim(),
})
