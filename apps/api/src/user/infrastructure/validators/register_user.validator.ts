import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const registerUserValidator = vine.object({
  firstName: vine.string().trim(),
  lastName: vine.string().trim(),
  email: vine.string().trim().email(),
  password: vine.string().trim(),
})

export type RegisterUserValidator = Infer<typeof registerUserValidator>
