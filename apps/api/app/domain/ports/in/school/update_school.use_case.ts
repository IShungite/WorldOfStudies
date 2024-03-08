import { Id } from '#domainModels/id/id'
import { School, UpdateSchoolDto } from '#domainModels/school/school'

export interface UpdateSchoolUseCase {
  update: (schoolId: Id, updateSchoolDto: UpdateSchoolDto) => Promise<School>
}
