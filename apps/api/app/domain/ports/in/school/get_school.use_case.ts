import { Id } from '#domainModels/id/id'
import { School } from '#domainModels/school/school'

export interface GetSchoolUseCase {
  get: (schoolId: Id) => Promise<School | null>
}
