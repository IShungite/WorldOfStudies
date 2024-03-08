import { Id } from '#domainModels/id/id'
import { CreateSchoolDto, School } from '#domainModels/school/school'

export interface GetSchoolUseCase {
  get: (schoolId: Id) => Promise<School | null>
}
