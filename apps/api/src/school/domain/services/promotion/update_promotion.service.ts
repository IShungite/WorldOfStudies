import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { Promotion, UpdatePromotionDto } from '#school/domain/models/promotion'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { School } from '#school/domain/models/school'

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
