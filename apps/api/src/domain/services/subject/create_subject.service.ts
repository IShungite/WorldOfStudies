import { Promotion } from '#domain/models/school/promotion'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { CreateSubjectDto, Subject } from '#domain/models/school/subject'
import { ISchoolsRepository } from '#domain/ports/out/schools.repository'
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
