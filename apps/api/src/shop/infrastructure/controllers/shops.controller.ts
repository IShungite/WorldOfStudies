import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreateShopService } from '../../domain/services/create_shop.service.js'
import { createShopValidator } from '../validators/create_shop.validator.js'
import { ShopApiMapper } from '../mappers/shop_api.mapper.js'

@inject()
export default class ShopsController {
  constructor(private readonly createShopService: CreateShopService) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createShopValidator, data: request.all() })

    const shop = await this.createShopService.execute(payload)

    return response.created(ShopApiMapper.toResponse(shop))
  }
}
