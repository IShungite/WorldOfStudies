import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreatePromotionDto, Promotion } from '#school/domain/models/promotion'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { School } from '#school/domain/models/school'

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
