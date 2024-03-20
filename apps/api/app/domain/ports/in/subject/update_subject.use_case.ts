import { Id } from '#domainModels/id/id'
import { Subject, UpdateSubjectDto } from '#domainModels/school/subject'

export interface UpdateSubjectUseCase {
  update: (
    schoolId: Id,
    promotionId: Id,
    subjectId: Id,
    updateSubjectDto: UpdateSubjectDto
  ) => Promise<Subject>
}
