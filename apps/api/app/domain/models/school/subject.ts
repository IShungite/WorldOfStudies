import { Id } from '#domainModels/id/id'

export type CreateSubjectDto = {
  name: string
  promotionId: Id
}

type SubjectProps = {
  id?: Id
  name: string
}

export class Subject {
  readonly id: Id
  readonly name: string
  constructor({ id, name }: SubjectProps) {
    this.id = id ?? Id.factory()
    this.name = name
  }
}
