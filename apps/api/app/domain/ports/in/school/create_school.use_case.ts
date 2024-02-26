import { CreateSchoolDto, School } from '#domainModels/school'

export interface CreateSchoolUseCase {
  create: (createSchoolDto: CreateSchoolDto) => Promise<School>
}
