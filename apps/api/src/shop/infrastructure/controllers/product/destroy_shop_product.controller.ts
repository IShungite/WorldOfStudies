import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DestroyShopProductService } from '#shop/domain/services/product/delete_shop_product.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

@inject()
export default class DestroyShopProductController {
  constructor(private readonly destroyShopProductService: DestroyShopProductService) {}

  /**
   * Handle form submission for the create action
   */
  async handle({ params, response }: HttpContext) {
    const [schoolId, categoryId, productId] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.schoolId,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.categoryId,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.productId,
      }),
    ])

    await this.destroyShopProductService.execute(schoolId, categoryId, productId)

    return response.noContent()
  }
}
