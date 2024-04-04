import vine from '@vinejs/vine'

export const paginationValidator = vine.object({
  page: vine.number().optional(),
  perPage: vine.number().optional(),
})
