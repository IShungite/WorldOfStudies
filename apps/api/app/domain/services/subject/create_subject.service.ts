import { Promotion } from '#domainModels/promotion'
import { School } from '#domainModels/school'
import { CreateSubjectDto, Subject } from '#domainModels/subject'
import { CreateSubjectUseCase } from '#domainPorts/in/subject/create_subject.use_case'
import { ISchoolsRepository } from '#domainPorts/out/schools.repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateSubjectService implements CreateSubjectUseCase {
  constructor(private readonly schoolRepository: ISchoolsRepository) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(createSubjectDto)

    const school = await this.schoolRepository.getByPromotionId(createSubjectDto.promotionId)

    if (!school) {
      throw new Error('Promotion not found')
    }

    const promotion = school.promotions.find((p) => p.id.equals(createSubjectDto.promotionId))

    if (!promotion) {
      throw new Error('Promotion not found')
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
