import { Id } from '#domainModels/id'

export type CreateSchoolDto = {
  name: string
}

type SchoolProps = {
  id?: Id
  name: string
}

export class School {
  readonly id: Id
  readonly name: string

  constructor({ id, name }: SchoolProps) {
    this.id = id ?? Id.factory()
    this.name = name
  }
}
