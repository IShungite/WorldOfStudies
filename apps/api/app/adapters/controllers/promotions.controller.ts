import { CreatePromotionService } from '#domainServices/promotion/create_promotion.service'
import { createPromotionValidator } from '#validators/school/create_promotion.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class PromotionsController {
  constructor(private readonly createPromotionService: CreatePromotionService) {}

  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createPromotionValidator, data: request.all() })
    const promotion = await this.createPromotionService.execute(payload)

    return response.created({
      id: promotion.id.toString(),
      name: promotion.name,
      year: promotion.year,
    })
  }
}
