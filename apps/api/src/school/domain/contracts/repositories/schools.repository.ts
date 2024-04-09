import { Id } from '../../../../shared/id/domain/models/id.js'
import { School } from '../../models/school.js'

export abstract class ISchoolsRepository {
  abstract save(school: School): Promise<School>
  abstract getById(schoolId: Id): Promise<School | null>
  abstract getByPromotionId(promotionId: Id): Promise<School | null>
  abstract deleteById(schoolId: Id): Promise<void>
  abstract empty(): Promise<void>
}
