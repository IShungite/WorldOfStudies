import vine from '@vinejs/vine'

export const updateCharacterValidator = vine.object({
  name: vine.string().trim().optional(),
})
