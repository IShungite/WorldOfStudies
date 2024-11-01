import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DeleteShopCategoryService } from '#shop/domain/services/category/delete_shop_category.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'

@inject()
export default class DestroyShopCategoryController {
  constructor(private readonly deleteShopCategoryService: DeleteShopCategoryService) {}

  async handle({ params, response }: HttpContext) {
    const schoolId = await vine.validate({
      schema: domainIdValidator,
      data: params.schoolId,
    })
    const categoryId = await vine.validate({
      schema: domainIdValidator,
      data: params.categoryId,
    })

    await this.deleteShopCategoryService.execute(schoolId, categoryId)

    return response.noContent()
  }
}
