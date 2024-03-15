import { Id } from '#domainModels/id/id'
import { Promotion } from '#domainModels/school/promotion'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { School } from '#domainModels/school/school'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { SubjectNotFoundException } from '#domainModels/school/subject_not_found.exception'
import { DeleteSubjectUseCase } from '#domainPorts/in/subject/delete_subject.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteSubjectService implements DeleteSubjectUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async delete(schoolId: Id, promotionId: Id, subjectId: Id): Promise<void> {
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
