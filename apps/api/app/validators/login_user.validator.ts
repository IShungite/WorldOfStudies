import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const loginUserValidator = vine.object({
  email: vine.string().trim().email(),
  password: vine.string().trim(),
})

export type LoginUserValidator = Infer<typeof loginUserValidator>
