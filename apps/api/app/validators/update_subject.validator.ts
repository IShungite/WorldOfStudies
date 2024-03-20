import vine from '@vinejs/vine'

export const updateSubjectValidator = vine.object({
  name: vine.string().trim().optional(),
})
