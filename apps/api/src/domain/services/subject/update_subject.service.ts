import { Id } from '#domain/models/id/id'
import { Promotion } from '#domain/models/school/promotion'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { School } from '#domain/models/school/school'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { Subject, UpdateSubjectDto } from '#domain/models/school/subject'
import { SubjectNotFoundException } from '#domain/models/school/subject_not_found.exception'
import { ISchoolsRepository } from '#domain/contracts/repositories/schools.repository'
import { inject } from '@adonisjs/core'

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