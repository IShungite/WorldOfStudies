import { CreatePromotionDto, Promotion } from '#domainModels/school/promotion'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
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
