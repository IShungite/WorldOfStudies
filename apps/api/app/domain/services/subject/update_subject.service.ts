import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { Subject, UpdateSubjectDto } from '#domainModels/school/subject'
import { SubjectNotFoundException } from '#domainModels/school/subject_not_found.exception'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
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
