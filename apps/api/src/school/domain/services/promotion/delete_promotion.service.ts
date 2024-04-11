import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { School } from '#school/domain/models/school'

@inject()
export class DeletePromotionService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(schoolId: Id, promotionId: Id): Promise<void> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const promotion = school.promotions.find((p) => p.id.equals(promotionId))

    if (!promotion) {
      throw new PromotionNotFoundException(promotionId)
    }

    const newSchool = new School({
      ...school,
      promotions: school.promotions.filter((p) => !p.id.equals(promotion.id)),
    })

    await this.schoolsRepository.save(newSchool)
  }
}
