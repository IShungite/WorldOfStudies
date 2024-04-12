import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getUrl } from '#shared/infra/api/utils/get_url'
import { UpdateShopProductService } from '#shop/domain/services/product/update_shop_product.service'
import { updateShopProductValidator } from '#shop/infrastructure/validators/update_shop.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

@inject()
export default class UpdateShopProductController {
  constructor(private readonly updateShopProductService: UpdateShopProductService) {}

  /**
   * Handle form submission for the create action
   */
  async handle({ params, request, response }: HttpContext) {
    const [schoolId, categoryId, productId, payload] = await Promise.all([
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
      vine.validate({
        schema: updateShopProductValidator,
        data: request.all(),
      }),
    ])

    await this.updateShopProductService.execute(schoolId, categoryId, productId, payload)

    return response.location(getUrl(`/api/schools/${schoolId}/shop`)).noContent()
  }
}
