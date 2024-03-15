import { Id } from '#domainModels/id'

export interface DeleteSubjectUseCase {
  delete(schoolId: Id, promotionId: Id, subjectId: Id): Promise<void>
}
