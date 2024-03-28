import { Id } from '#domainModels/id/id'
import { Promotion, UpdatePromotionDto } from '#domainModels/school/promotion'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
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
