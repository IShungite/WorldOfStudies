import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getUrl } from '#utils/get_url'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { createShopCategoryValidator } from '#infrastructure/validators/shop/create_shop.validator'
import { CreateShopCategoryService } from '#domain/services/shop/category/create_shop_category.service'

@inject()
export default class StoreShopCategoryController {
  constructor(private readonly createShopCategoryService: CreateShopCategoryService) {}

  /**
   * Handle form submission for the create action
   */
  async handle({ params, request, response }: HttpContext) {
    const schoolId = await vine.validate({
      schema: domainIdValidator,
      data: params.schoolId,
    })

    const payload = await vine.validate({
      schema: createShopCategoryValidator,
      data: request.all(),
    })

    await this.createShopCategoryService.execute(schoolId, payload)

    return response.location(getUrl(`schools/${schoolId}/shop`)).noContent()
  }
}