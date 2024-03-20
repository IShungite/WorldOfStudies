import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'
import SchoolEntity from '#models/school'
import { createPromotionsValidator } from '#validators/create_promotion.validator'
import vine from '@vinejs/vine'
import { Promotion } from '#domainModels/school/promotion'

export class SchoolMapper {
  static toResponse(school: School): { id: string; name: string } {
    return {
      id: school.id.toString(),
      name: school.name,
    }
  }

  static async fromAdonis(newSchool: SchoolEntity): Promise<School> {
    const promotionsData = await vine.validate({
      schema: createPromotionsValidator,
      data: newSchool.promotions,
    })
    return new School({
      id: new Id(newSchool.id.toString()),
      name: newSchool.name,
      promotions: promotionsData.map((promotionData) => new Promotion(promotionData)),
    })
  }
}
