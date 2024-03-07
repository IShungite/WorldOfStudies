import vine from '@vinejs/vine'

export const updateSchoolValidator = vine.object({
  name: vine.string().trim().optional(),
})
