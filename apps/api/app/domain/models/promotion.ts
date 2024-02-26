import { Id } from '#domainModels/id'

export class Promotion {
  constructor(
    readonly id: Id,
    readonly name: string,
    readonly schoolId: Id
  ) {}
}
