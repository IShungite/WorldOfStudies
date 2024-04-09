import { Id } from '../../../../shared/id/domain/models/id.js'
import { Promotion, UpdatePromotionDto } from '../../models/promotion.js'
import { PromotionNotFoundException } from '../../models/promotion_not_found.exception.js'
import { School } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class UpdatePromotionService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(
    schoolId: Id,
    promotionId: Id,
    updatePromotionDto: UpdatePromotionDto
  ): Promise<Promotion> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const promotion = school.promotions.find((p) => p.id.equals(promotionId))

    if (!promotion) {
      throw new PromotionNotFoundException(promotionId)
    }

    const newPromotion = new Promotion({
      ...promotion,
      name: updatePromotionDto.name ?? promotion.name,
    })

    const newSchool = new School({
      ...school,
      promotions: school.promotions.map((p) => (p.id.equals(newPromotion.id) ? newPromotion : p)),
    })

    await this.schoolsRepository.save(newSchool)

    return newPromotion
  }
}
