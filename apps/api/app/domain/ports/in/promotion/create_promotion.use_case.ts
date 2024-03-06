import { CreatePromotionDto, Promotion } from '#domainModels/promotion'

export interface CreatePromotionUseCase {
  create: (createPromotionDto: CreatePromotionDto) => Promise<Promotion>
}
