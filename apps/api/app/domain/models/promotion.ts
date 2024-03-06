import { Id } from '#domainModels/id'
import { Subject } from '#domainModels/subject'

export type CreatePromotionDto = {
  name: string
  year: number
  schoolId: Id
}

type PromotionProps = {
  id?: Id
  name: string
  year: number
  subjects?: Subject[]
}

export class Promotion {
  readonly id: Id
  readonly name: string
  readonly year: number
  readonly subjects: Subject[]

  constructor({ id, name, year, subjects }: PromotionProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.year = year
    this.subjects = subjects ?? []
  }
}
