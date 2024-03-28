import { Id } from '#domainModels/id/id'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

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
