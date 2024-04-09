import { Id } from '../../../shared/id/domain/models/id.js'
import { School } from '../../domain/models/school.js'
import { ISchoolsRepository } from '../../domain/contracts/repositories/schools.repository.js'
import SchoolEntity from '../entities/school.js'
import { SchoolMapper } from '../mappers/school.mapper.js'
import testUtils from '@adonisjs/core/services/test_utils'
import PromotionEntity from '../entities/promotion.js'
import SubjectEntity from '../entities/subject.js'
import { Promotion } from '../../domain/models/promotion.js'

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

    const subjectsToRemove = promotionsGrouped.toKeep.flatMap((existingPromotion) =>
      existingPromotion.subjects.filter(
        (existingSubject) =>
          !school.promotions.find((newPromotion) =>
            newPromotion.subjects.find((newSubject) => newSubject.id.equals(existingSubject.id))
          )
      )
    )

    if (promotionsGrouped.toRemove.length > 0) {
      await PromotionEntity.query()
        .whereIn(
          'id',
          promotionsGrouped.toRemove.map((promotion) => promotion.id.toString())
        )
        .delete()
    }

    if (subjectsToRemove.length > 0) {
      await SubjectEntity.query()
        .whereIn(
          'id',
          subjectsToRemove.map((subject) => subject.id.toString())
        )
        .delete()
    }
  }

  async save(school: School): Promise<School> {
    await this.deleteExistingNestedEntity(school)

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

    return school ? SchoolMapper.fromLucid(school) : null
  }

  async getByPromotionId(promotionId: Id): Promise<School | null> {
    const school = await SchoolEntity.query()
      .preload('promotions', (query) =>
        query.where('id', promotionId.toString()).preload('subjects')
      )
      .first()

    return school ? SchoolMapper.fromLucid(school) : null
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
