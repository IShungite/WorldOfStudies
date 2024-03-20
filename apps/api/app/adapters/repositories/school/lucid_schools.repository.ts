import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import SchoolEntity from '#models/school'
import { SchoolMapper } from '#mappers/school.mapper'
import testUtils from '@adonisjs/core/services/test_utils'
import PromotionEntity from '#models/promotion'
import SubjectEntity from '#models/subject'

export class LucidSchoolsRepository implements ISchoolsRepository {
  async save(school: School): Promise<School> {
    await SchoolEntity.updateOrCreate(
      {
        id: Number.parseInt(school.id.toString(), 10),
      },
      {
        name: school.name,
      }
    )

    await Promise.all(
      school.promotions.map(async (promotion) => {
        await PromotionEntity.updateOrCreate(
          { id: Number.parseInt(promotion.id.toString()) },
          {
            name: promotion.name,
            year: promotion.year,
            schoolId: Number.parseInt(school.id.toString(), 10),
          }
        )

        return Promise.all(
          promotion.subjects.map((subject) =>
            SubjectEntity.updateOrCreate(
              { id: Number.parseInt(subject.id.toString()) },
              { name: subject.name, promotionId: Number.parseInt(promotion.id.toString(), 10) }
            )
          )
        )
      })
    )

    return school
  }

  async getById(schoolId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .where('id', schoolId.toString())
      .preload('promotions', (query) => query.preload('subjects'))
      .first()

    return school ? SchoolMapper.fromAdonis(school) : null
  }

  async getByPromotionId(promotionId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .preload('promotions', (query) =>
        query.where('id', promotionId.toString()).preload('subjects')
      )
      .first()

    return school ? SchoolMapper.fromAdonis(school) : null
  }

  async deleteById(schoolId: Id): Promise<void> {
    await SchoolEntity.query().where('id', schoolId.toString()).delete()
  }

  async empty(): Promise<void> {
    await testUtils
      .db()
      .truncate()
      .then((trunc) => trunc())
  }
}
