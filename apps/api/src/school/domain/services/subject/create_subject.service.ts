import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { CreateSubjectDto, Subject } from '#school/domain/models/subject'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { Promotion } from '#school/domain/models/promotion'
import { School } from '#school/domain/models/school'

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
