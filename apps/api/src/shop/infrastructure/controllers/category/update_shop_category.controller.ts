import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { updateShopCategoryValidator } from '#shop/infrastructure/validators/update_shop.validator'
import { UpdateShopCategoryService } from '#shop/domain/services/category/update_shop_category.service'

@inject()
export default class UpdateShopCategoryController {
  constructor(private readonly updateShopCategoryService: UpdateShopCategoryService) {}

  async handle({ params, request, response }: HttpContext) {
    const [schoolId, categoryId] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: params.schoolId,
      }),
      vine.validate({
        schema: domainIdValidator,
        data: params.categoryId,
      }),
    ])
    const payload = await vine.validate({
      schema: updateShopCategoryValidator,
      data: request.all(),
    })

    await this.updateShopCategoryService.execute(schoolId, categoryId, payload)

    return response.location(getFullUrl(`/api/schools/${schoolId}/shop`)).noContent()
  }
}
