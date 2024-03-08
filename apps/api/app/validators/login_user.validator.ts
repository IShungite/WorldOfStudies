import vine from '@vinejs/vine'

export const loginUserValidator = vine.object({
  email: vine.string().trim().email(),
  password: vine.string().trim(),
})
