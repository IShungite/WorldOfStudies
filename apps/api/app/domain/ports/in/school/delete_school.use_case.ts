import { Id } from '#domainModels/id/id'

export interface DeleteSchoolUseCase {
  delete(schoolId: Id): Promise<void>
}
