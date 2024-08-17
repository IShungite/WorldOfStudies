import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { PurchaseShopProductService } from '#shop/domain/services/purchase_shop_product.service'
import { purchaseShopProductValidator } from '#shop/infrastructure/validators/purchase_shop_product.validator'

@inject()
export default class PurchaseShopProductController {
  constructor(private readonly purchaseShopProductService: PurchaseShopProductService) {}

  async handle({ request, response }: HttpContext) {
    const payload = await vine.validate({
      schema: purchaseShopProductValidator,
      data: request.all(),
    })

    await this.purchaseShopProductService.execute(payload)

    return response.ok({})
  }
}
