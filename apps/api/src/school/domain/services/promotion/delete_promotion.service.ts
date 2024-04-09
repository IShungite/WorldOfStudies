import { Id } from '../../../../shared/id/domain/models/id.js'
import { PromotionNotFoundException } from '../../models/promotion_not_found.exception.js'
import { School } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
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
