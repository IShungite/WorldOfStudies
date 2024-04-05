import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getUrl } from '#utils/get_url'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { createShopProductValidator } from '#infrastructure/validators/shop/create_shop.validator'
import { CreateShopProductService } from '#domain/services/shop/product/create_shop_product.service'

@inject()
export default class StoreShopProductController {
  constructor(private readonly createShopProductService: CreateShopProductService) {}

  /**
   * Handle form submission for the create action
   */
  async handle({ params, request, response }: HttpContext) {
    const [schoolId, categoryId, payload] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.schoolId,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.categoryId,
      }),
      vine.validate({
        schema: createShopProductValidator,
        data: request.all(),
      }),
    ])

    await this.createShopProductService.execute(schoolId, categoryId, payload)

    return response.location(getUrl(`schools/${schoolId}/shop`)).noContent()
  }
}