import { Id } from '#domainModels/id/id'
import { Promotion, UpdatePromotionDto } from '#domainModels/school/promotion'

export interface UpdatePromotionUseCase {
  update: (
    schoolId: Id,
    promotionId: Id,
    updatePromotionDto: UpdatePromotionDto
  ) => Promise<Promotion>
}
