import { Id } from '#domainModels/id'

export type CreatePromotionDto = {
  name: string
  year: number
  schoolId: Id
}

type PromotionProps = {
  id?: Id
  name: string
  year: number
}

export class Promotion {
  readonly id: Id
  readonly name: string
  readonly year: number

  constructor({ id, name, year }: PromotionProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.year = year
  }
}
