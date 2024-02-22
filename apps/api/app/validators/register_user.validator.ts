import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)
