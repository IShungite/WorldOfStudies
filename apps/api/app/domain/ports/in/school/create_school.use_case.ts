import { CreateSchoolDto, School } from '#domainModels/school/school'

export interface CreateSchoolUseCase {
  create: (createSchoolDto: CreateSchoolDto) => Promise<School>
}
