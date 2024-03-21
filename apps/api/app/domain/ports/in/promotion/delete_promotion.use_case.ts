import { Id } from '#domainModels/id/id'

export interface DeletePromotionUseCase {
  delete(schoolId: Id, promotionId: Id): Promise<void>
}
