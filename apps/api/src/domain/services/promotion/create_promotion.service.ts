import { CreatePromotionDto, Promotion } from '#domain/models/school/promotion'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreatePromotionService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = new Promotion(createPromotionDto)

    const school = await this.schoolsRepository.getById(createPromotionDto.schoolId)

    if (!school) {
      throw new SchoolNotFoundException(createPromotionDto.schoolId)
    }

    const newSchool = new School({
      ...school,
      promotions: [...school.promotions, promotion],
    })

    await this.schoolsRepository.save(newSchool)

    return promotion
  }
}
