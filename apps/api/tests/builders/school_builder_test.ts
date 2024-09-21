import { Id } from '#shared/id/domain/models/id'
import { School } from '#school/domain/models/school'
import { Promotion } from '#school/domain/models/promotion'
import { Subject } from '#school/domain/models/subject'

export class SchoolBuilderTest {
  private _id = Id.factory()
  private _name = 'name'
  private _promotions: Promotion[] = []

  build(): School {
    return new School({
      id: this._id,
      name: this._name,
      promotions: this._promotions,
    })
  }

  withRandomPromotionsAndSubjects(promotionsNumber: number, subjectsNumber: number): this {
    this._promotions = Array.from(
      { length: promotionsNumber },
      (i) =>
        new Promotion({
          id: Id.factory(),
          name: `promotion ${i}`,
          year: 2020,
          subjects: Array.from(
            { length: subjectsNumber },
            (j) =>
              new Subject({
                id: Id.factory(),
                name: `subject ${j}-${i}`,
              })
          ),
        })
    )
    return this
  }

  withSubjects(subjects: Subject[]): this {
    this._promotions = this._promotions.map((promotion) => {
      return new Promotion({
        ...promotion,
        subjects: subjects,
      })
    })
    return this
  }
}
