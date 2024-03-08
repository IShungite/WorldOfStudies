import { CreateSubjectDto, Subject } from '#domainModels/school/subject'

export interface CreateSubjectUseCase {
  create: (createSubjectDto: CreateSubjectDto) => Promise<Subject>
}
