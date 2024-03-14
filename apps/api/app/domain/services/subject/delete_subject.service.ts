import { Id } from '#domainModels/id'
import { Promotion } from '#domainModels/promotion'
import { School } from '#domainModels/school'
import { DeleteSubjectUseCase } from '#domainPorts/in/subject/delete_subject.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteSubjectService implements DeleteSubjectUseCase {
  constructor(private readonly schoolsRepository: ISchoolsRepository) {}

  async delete(schoolId: Id, promotionId: Id, subjectId: Id): Promise<void> {
    const school = await this.schoolsRepository.getById(schoolId)

    if (!school) {
      throw new Error('School not found')
    }

    const promotion = school.promotions.find((p) => p.id.equals(promotionId))

    if (!promotion) {
      throw new Error('Promotion not found')
    }

    const subject = promotion.subjects.find((s) => s.id.equals(subjectId))

    if (!subject) {
      throw new Error('Subject not found')
    }

    const newPromotion = new Promotion({
      ...promotion,
      subjects: [...promotion.subjects.filter((s) => !s.id.equals(subjectId))],
    })

    const newSchool = new School({
      ...school,
      promotions: school.promotions.map((p) => (p.id === newPromotion.id ? newPromotion : p)),
    })

    await this.schoolsRepository.save(newSchool)
  }
}
