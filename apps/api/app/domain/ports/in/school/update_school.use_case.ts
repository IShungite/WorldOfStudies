import { Id } from '#domainModels/id'
import { School, UpdateSchoolDto } from '#domainModels/school'

export interface UpdateSchoolUseCase {
  update: (schoolId: Id, updateSchoolDto: UpdateSchoolDto) => Promise<School>
}
