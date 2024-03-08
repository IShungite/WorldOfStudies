import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'

export type CreateSchoolDto = {
  name: string
}

export type UpdateSchoolDto = {
  name?: string
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
