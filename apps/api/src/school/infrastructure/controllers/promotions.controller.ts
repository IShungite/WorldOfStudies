import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { CreatePromotionService } from '#school/domain/services/promotion/create_promotion.service'
import { createPromotionValidator } from '#school/infrastructure/validators/school/create_promotion.validator'

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
