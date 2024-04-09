import { Id } from '../../../shared/id/domain/models/id.js'
import { School } from '../../domain/models/school.js'
import { ISchoolsRepository } from '../../domain/contracts/repositories/schools.repository.js'

export class InMemorySchoolsRepository implements ISchoolsRepository {
  private schools: Record<string, School> = {}

  async save(school: School): Promise<School> {
    this.schools[school.id.toString()] = school
    return school
  }

  async getById(schoolId: Id): Promise<School | null> {
    return this.schools[schoolId.toString()] ?? null
  }

  async getByPromotionId(promotionId: Id): Promise<School | null> {
    return (
      Object.values(this.schools).find((school) =>
        school.promotions.find((promotion) => promotion.id.equals(promotionId))
      ) ?? null
    )
  }

  async deleteById(schoolId: Id): Promise<void> {
    delete this.schools[schoolId.toString()]
  }

  async empty(): Promise<void> {
    this.schools = {}
  }
}
