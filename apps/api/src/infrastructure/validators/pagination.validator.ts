import vine from '@vinejs/vine'

export const paginationValidator = vine.object({
  page: vine.number().optional(),
  limit: vine.number().optional(),
})
