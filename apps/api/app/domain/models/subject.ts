import { Id } from '#domainModels/id'

export class Subject {
  constructor(
    readonly id: Id,
    readonly name: string
  ) {}
}
