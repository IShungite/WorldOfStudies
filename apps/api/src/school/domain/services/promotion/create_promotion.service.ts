import { CreatePromotionDto, Promotion } from '../../models/promotion.js'
import { School } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
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
