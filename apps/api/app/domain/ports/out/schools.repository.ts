import { Id } from '#domainModels/id'
import { School } from '#domainModels/school'

export abstract class ISchoolsRepository {
  abstract save(school: School): Promise<School>
  abstract getById(schoolId: Id): Promise<School | null>
}
