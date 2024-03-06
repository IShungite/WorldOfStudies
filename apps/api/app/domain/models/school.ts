import { Id } from '#domainModels/id'
import { Promotion } from '#domainModels/promotion'

export type CreateSchoolDto = {
  name: string
}

type SchoolProps = {
  id?: Id
  name: string
  promotions?: Promotion[]
}

export class School {
  readonly id: Id
  readonly name: string
  readonly promotions: Promotion[]

  constructor({ id, name, promotions }: SchoolProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.promotions = promotions ?? []
  }
}
