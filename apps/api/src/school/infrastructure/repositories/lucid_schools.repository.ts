import testUtils from '@adonisjs/core/services/test_utils'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolMapper } from '#school/infrastructure/mappers/school.mapper'
import { School } from '#school/domain/models/school'
import { Promotion } from '#school/domain/models/promotion'
import PromotionEntity from '#school/infrastructure/entities/promotion'
import SchoolEntity from '#school/infrastructure/entities/school'
import SubjectEntity from '#school/infrastructure/entities/subject'
import { User } from '#user/domain/models/user'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'

export class LucidSchoolsRepository implements ISchoolsRepository {
  private async deleteExistingNestedEntity(school: School) {
    const existingSchoolEntity = await this.getById(school.id)

    if (!existingSchoolEntity) return

    const promotionsGrouped = existingSchoolEntity.promotions.reduce(
      (groupedPromotions, promotion) => {
        if (school.promotions.find((newPromotion) => newPromotion.id.equals(promotion.id))) {
          groupedPromotions.toKeep.push(promotion)
        } else {
          groupedPromotions.toRemove.push(promotion)
        }

        return groupedPromotions
      },
      { toRemove: [] as Promotion[], toKeep: [] as Promotion[] }
    )

    if (promotionsGrouped.toRemove.length > 0) {
      await PromotionEntity.query()
        .whereIn(
          'id',
          promotionsGrouped.toRemove.map((promotion) => promotion.id.toString())
        )
        .delete()
    }
  }

  async save(school: School): Promise<School> {
    await this.deleteExistingNestedEntity(school)

    const schoolEntity = await SchoolEntity.updateOrCreate(
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
      })
    )

    const promotionEntities = await PromotionEntity.query().whereIn(
      'id',
      school.promotions.map((promotion) => promotion.id.toString())
    )

    await Promise.all(
      promotionEntities.map(async (promotionEntity) => {
        const subjects = school.promotions.find((promotion) =>
          promotion.id.equals(new Id(promotionEntity.id.toString()))
        )?.subjects

        if (!subjects) {
          return
        }

        await promotionEntity
          .related('subjects')
          .sync(subjects.map((subject) => subject.id.toString()))
      })
    )

    await schoolEntity.related('admins').sync(school.admins.map((admin) => admin.id.toString()))

    return school
  }

  async getById(schoolId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .where('id', schoolId.toString())
      .preload('promotions', (query) => query.preload('subjects'))
      .preload('admins')
      .first()

    return school ? SchoolMapper.fromLucid(school) : null
  }

  async getAdmins(schoolId: Id): Promise<User[]> {
    const school = await SchoolEntity.query()
      .where('id', schoolId.toString())
      .preload('admins')
      .first()

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    return school.admins.map((user) => UserStorageMapper.fromLucid(user))
  }

  async getByPromotionId(promotionId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .preload('promotions', (query) =>
        query.where('id', promotionId.toString()).preload('subjects')
      )
      .first()

    return school ? SchoolMapper.fromLucid(school) : null
  }

  async getByCharacterIds(characterIds: Id[]): Promise<School[]> {
    const schools = await SchoolEntity.query().preload('promotions', (query) =>
      query
        .preload('characters', (query2) =>
          query2.whereIn(
            'id',
            characterIds.map((id) => id.toString())
          )
        )
        .preload('subjects')
    )

    return schools.map((school) => SchoolMapper.fromLucid(school))
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
