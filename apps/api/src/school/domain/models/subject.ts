import { Id } from '#shared/id/domain/models/id'

export type CreateSubjectDto = {
  name: string
}

export type UpdateSubjectDto = {
  name?: string
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

  toJson() {
    return {
      id: this.id.toString(),
      name: this.name,
    }
  }
}
