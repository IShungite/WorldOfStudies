import { Id } from '#domainModels/id/id'

export interface DeleteSubjectUseCase {
  delete(schoolId: Id, promotionId: Id, subjectId: Id): Promise<void>
}
