import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateShopService } from '#domainServices/shop/create_shop.service'
import { createShopValidator } from '#validators/shop/create_shop.validator'
import { ShopMapper } from '#mappers/shop.mapper'

@inject()
export default class ShopsController {
  constructor(private readonly createShopService: CreateShopService) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createShopValidator, data: request.all() })

    const shop = await this.createShopService.create(payload)

    return response.created(ShopMapper.toResponse(shop))
  }
}
