import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getUrl } from '#utils/get_url'
import { domainIdValidator } from '../../../../shared/id/infrastructure/validators/domain_id.validator.js'
import { updateShopProductValidator } from '../../validators/update_shop.validator.js'
import { UpdateShopProductService } from '../../../domain/services/product/update_shop_product.service.js'

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

    return response.location(getUrl(`schools/${schoolId}/shop`)).noContent()
  }
}
