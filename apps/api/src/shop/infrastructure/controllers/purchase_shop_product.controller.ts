import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { PurchaseShopProductService } from '#shop/domain/services/purchase_shop_product.service'
import { purchaseShopProductValidator } from '#shop/infrastructure/validators/purchase_shop_product.validator'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { PurchaseProductResponse } from '@world-of-studies/api-types'

@inject()
export default class PurchaseShopProductController {
  constructor(private readonly purchaseShopProductService: PurchaseShopProductService) {}

  async handle({ request, auth, params, response }: HttpContext) {
    const userEntity = await auth.authenticate()

    const payload = await vine.validate({
      schema: purchaseShopProductValidator,
      data: request.all(),
    })

    const productId = await vine.validate({
      schema: domainIdValidator,
      data: params.productId,
    })

    const user = UserStorageMapper.fromLucid(userEntity)

    const character = await this.purchaseShopProductService.execute({
      characterId: payload.characterId,
      productId,
      user,
    })

    const responseData: PurchaseProductResponse = {
      result: {
        berries: character.berries,
      },
      message: 'product_purchased',
    }

    return response.ok(responseData)
  }
}
