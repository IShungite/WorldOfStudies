import vine from '@vinejs/vine'

export const updatePromotionValidator = vine.object({
  name: vine.string().trim().optional(),
})
