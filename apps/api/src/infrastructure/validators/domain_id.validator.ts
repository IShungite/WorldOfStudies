import { Id } from '#domain/models/id/id'
import vine from '@vinejs/vine'

export const domainIdValidator = vine
  .string()
  .trim()
  .transform((value) => new Id(value))
