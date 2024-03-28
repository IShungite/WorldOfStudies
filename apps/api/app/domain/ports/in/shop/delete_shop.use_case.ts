import { Id } from '#domainModels/id/id'

export interface DeleteShopUseCase {
  delete(schoolId: Id): Promise<void>
}
