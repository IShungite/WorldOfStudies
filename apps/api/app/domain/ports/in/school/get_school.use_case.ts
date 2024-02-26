import { Id } from '#domainModels/id'
import { CreateSchoolDto, School } from '#domainModels/school'

export interface GetSchoolUseCase {
  get: (schoolId: Id) => Promise<School | null>
}
