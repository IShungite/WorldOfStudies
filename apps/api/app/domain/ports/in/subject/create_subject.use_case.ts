import { CreateSubjectDto, Subject } from '#domainModels/subject'

export interface CreateSubjectUseCase {
  create: (createSubjectDto: CreateSubjectDto) => Promise<Subject>
}
