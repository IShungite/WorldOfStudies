import { Id } from '#domain/models/id/id'
import { Promotion, UpdatePromotionDto } from '#domain/models/school/promotion'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ISchoolsRepository } from '#domain/ports/out/schools.repository'
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
