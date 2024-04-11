import { inject } from '@adonisjs/core'
import { ISchoolsRepository } from '#school/domain/contracts/repositories/schools.repository'
import { Id } from '#shared/id/domain/models/id'
import { Subject, UpdateSubjectDto } from '#school/domain/models/subject'
import { SchoolNotFoundException } from '#school/domain/models/school_not_found.exception'
import { PromotionNotFoundException } from '#school/domain/models/promotion_not_found.exception'
import { SubjectNotFoundException } from '#school/domain/models/subject_not_found.exception'
import { Promotion } from '#school/domain/models/promotion'
import { School } from '#school/domain/models/school'

@inject()
export class UpdateSubjectService {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async execute(
    schoolId: Id,
    promotionId: Id,
    subjectId: Id,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<Subject> {
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

    const newSubject = new Subject({
      id: subject.id,
      name: updateSubjectDto.name ?? subject.name,
    })

    const newPromotion = new Promotion({
      ...promotion,
      subjects: promotion.subjects.map((s) => (s.id.equals(newSubject.id) ? newSubject : s)),
    })

    const newSchool = new School({
      ...school,
      promotions: school.promotions.map((p) => (p.id.equals(newPromotion.id) ? newPromotion : p)),
    })

    await this.schoolsRepository.save(newSchool)

    return newSubject
  }
}
