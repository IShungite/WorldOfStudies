import vine from '@vinejs/vine'

export const createSchoolValidator = vine.object({
  name: vine.string().trim(),
})
