import { Promotion } from '../../models/promotion.js'
import { PromotionNotFoundException } from '../../models/promotion_not_found.exception.js'
import { School } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { CreateSubjectDto, Subject } from '../../models/subject.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSubjectService {
  constructor(private readonly schoolRepository: ISchoolsRepository) {}

  async execute(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(createSubjectDto)

    const school = await this.schoolRepository.getByPromotionId(createSubjectDto.promotionId)

    if (!school) {
      throw new SchoolNotFoundException()
    }

    const promotion = school.promotions.find((p) => p.id.equals(createSubjectDto.promotionId))

    if (!promotion) {
      throw new PromotionNotFoundException(createSubjectDto.promotionId)
    }

    const newPromotion = new Promotion({
      ...promotion,
      subjects: [...promotion.subjects, subject],
    })

    const newSchool = new School({
      ...school,
      promotions: school.promotions.map((p) => (p.id === newPromotion.id ? newPromotion : p)),
    })

    await this.schoolRepository.save(newSchool)

    return subject
  }
}
