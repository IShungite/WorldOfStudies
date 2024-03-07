import { Id } from '#domainModels/id'

export interface DeleteSchoolUseCase {
  delete(schoolId: Id): Promise<void>
}
