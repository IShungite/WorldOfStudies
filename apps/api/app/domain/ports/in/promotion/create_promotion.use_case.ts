import { CreatePromotionDto, Promotion } from '#domainModels/school/promotion'

export interface CreatePromotionUseCase {
  create: (createPromotionDto: CreatePromotionDto) => Promise<Promotion>
}
