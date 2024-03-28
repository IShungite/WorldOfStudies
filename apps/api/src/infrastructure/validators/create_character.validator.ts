import vine from '@vinejs/vine'

export const createCharacterValidator = vine.object({
  name: vine.string().trim(),
})
