import { Id } from '../../domain/models/id.js'
import vine from '@vinejs/vine'

export const domainIdValidator = vine
  .string()
  .trim()
  .transform((value) => new Id(value))
