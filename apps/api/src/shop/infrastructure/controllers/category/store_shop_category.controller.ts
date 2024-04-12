import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { getUrl } from '#shared/infra/api/utils/get_url'
import { CreateShopCategoryService } from '#shop/domain/services/category/create_shop_category.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { createShopCategoryValidator } from '#shop/infrastructure/validators/create_shop.validator'

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

    return response.location(getUrl(`/api/schools/${schoolId}/shop`)).noContent()
  }
}
