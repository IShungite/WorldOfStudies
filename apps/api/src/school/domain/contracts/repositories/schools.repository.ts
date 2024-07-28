import { Id } from '#shared/id/domain/models/id'
import { School } from '#school/domain/models/school'
import { User } from '#user/domain/models/user'

export abstract class ISchoolsRepository {
  abstract save(school: School): Promise<School>
  abstract getById(schoolId: Id): Promise<School | null>
  abstract getAdmins(schoolId: Id): Promise<User[]>
  abstract getByPromotionId(promotionId: Id): Promise<School | null>
  abstract getByCharacterIds(characterIds: Id[]): Promise<School[]>
  abstract deleteById(schoolId: Id): Promise<void>
  abstract empty(): Promise<void>
}
