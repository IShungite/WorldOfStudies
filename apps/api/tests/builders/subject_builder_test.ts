import { Subject } from '#school/domain/models/subject'
import { Id } from '#shared/id/domain/models/id'

export class SubjectBuilderTest {
  private _id = Id.factory()
  private _name = 'Maths'

  build(): Subject {
    return new Subject({
      id: this._id,
      name: this._name,
    })
  }

  withName(name: string): this {
    this._name = name
    return this
  }
}
