import { Id } from '../../../../shared/id/domain/models/id.js'
import { Promotion } from '../../models/promotion.js'
import { PromotionNotFoundException } from '../../models/promotion_not_found.exception.js'
import { School } from '../../models/school.js'
import { SchoolNotFoundException } from '../../models/school_not_found.exception.js'
import { SubjectNotFoundException } from '../../models/subject_not_found.exception.js'
import { ISchoolsRepository } from '../../contracts/repositories/schools.repository.js'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteSubjectService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(schoolId: Id, promotionId: Id, subjectId: Id): Promise<void> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new SchoolNotFoundException(schoolId)
    }

    const promotion = school.promotions.find((p) => p.id.equals(promotionId))

    if (!promotion) {
      throw new PromotionNotFoundException(promotionId)
    }

    const subject = promotion.subjects.find((s) => s.id.equals(subjectId))

    if (!subject) {
      throw new SubjectNotFoundException(subjectId)
    }

    const newPromotion = new Promotion({
      ...promotion,
      subjects: [...promotion.subjects.filter((s) => !s.id.equals(subjectId))],
    })

    const newSchool = new School({
      ...school,
      promotions: school.promotions.map((p) => (p.id.equals(newPromotion.id) ? newPromotion : p)),
    })

    await this.schoolsRepository.save(newSchool)
  }
}
