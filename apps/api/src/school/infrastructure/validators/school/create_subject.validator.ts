import vine from '@vinejs/vine'

export const createSubjectValidator = vine.object({
  name: vine.string().trim(),
})
