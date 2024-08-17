import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

export const purchaseShopProductValidator = vine.object({
  characterId: domainIdValidator,
})
