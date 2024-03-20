import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import SchoolEntity from '#models/school'
import { SchoolMapper } from '#mappers/school.mapper'
import testUtils from '@adonisjs/core/services/test_utils'

export class LucidSchoolsRepository implements ISchoolsRepository {
  async save(school: School): Promise<School> {
    const newSchool = await SchoolEntity.updateOrCreate(
      {
        id: Number.parseInt(school.id.toString(), 10),
      },
      {
        id: Number.parseInt(school.id.toString(), 10),
        name: school.name,
        promotions: JSON.stringify(school.promotions.map((p) => p.toJson())),
      }
    )

    return SchoolMapper.fromAdonis(newSchool)
  }

  async getById(schoolId: Id): Promise<School | null> {
    const school = await SchoolEntity.find(schoolId.toString())

    return school ? SchoolMapper.fromAdonis(school) : null
  }

  async getByPromotionId(promotionId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .whereJson('promotions', {
        id: promotionId.toString(),
      })
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
