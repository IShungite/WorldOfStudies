import { Id } from '#domain/models/id/id'
import { Subject } from '#domain/models/school/subject'

export type CreatePromotionDto = {
  name: string
  year: number
  schoolId: Id
}

export type UpdatePromotionDto = {
  name?: string
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

  toJson() {
    return {
      id: this.id.toString(),
      name: this.name,
      year: this.year,
      subjects: this.subjects.map((s) => s.toJson()),
    }
  }
}
