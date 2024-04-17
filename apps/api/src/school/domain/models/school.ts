import { Id } from '#shared/id/domain/models/id'
import { Promotion } from '#school/domain/models/promotion'
import { User } from '#user/domain/models/user'

export type CreateSchoolDto = {
  name: string
}

export type UpdateSchoolDto = {
  name?: string
  admins?: User[]
}

type SchoolProps = {
  id?: Id
  name: string
  admins?: User[]
  promotions?: Promotion[]
}

export class School {
  readonly id: Id
  readonly name: string
  readonly admins: User[]
  readonly promotions: Promotion[]

  constructor({ id, name, promotions, admins }: SchoolProps) {
    this.id = id ?? Id.factory()
    this.name = name
    this.promotions = promotions ?? []
    this.admins = admins ?? []
  }
}
