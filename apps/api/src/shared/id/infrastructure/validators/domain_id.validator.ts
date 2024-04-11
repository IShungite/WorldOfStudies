import vine from '@vinejs/vine'
import { Id } from '#shared/id/domain/models/id'

export const domainIdValidator = vine
  .string()
  .trim()
  .transform((value) => new Id(value))
