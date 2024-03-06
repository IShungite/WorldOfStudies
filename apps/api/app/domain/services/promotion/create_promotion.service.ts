import { CreatePromotionDto, Promotion } from '#domainModels/promotion'
import { School } from '#domainModels/school'
import { CreatePromotionUseCase } from '#domainPorts/in/promotion/create_promotion.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreatePromotionService implements CreatePromotionUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = new Promotion(createPromotionDto)

    const school = await this.schoolsRepository.getById(createPromotionDto.schoolId)

    if (!school) {
      throw new Error('School not found')
    }

    const newSchool = new School({
      ...school,
      promotions: [...school.promotions, promotion],
    })

    await this.schoolsRepository.save(newSchool)

    return promotion
  }
}
