import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'

export abstract class ISchoolsRepository {
  abstract save(school: School): Promise<School>
  abstract getById(schoolId: Id): Promise<School | null>
  abstract getByPromotionId(promotionId: Id): Promise<School | null>
  abstract deleteById(schoolId: Id): Promise<void>
  abstract empty(): Promise<void>
}
