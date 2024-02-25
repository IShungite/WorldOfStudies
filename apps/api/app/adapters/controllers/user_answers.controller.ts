import { CreateUserAnswerService } from '#domainServices/user_answer/create_user_answer.service'
import { createUserAnswerValidator } from '#validators/create_user_answer.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class UserAnswersController {
  constructor(private readonly createUserAnswer: CreateUserAnswerService) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await vine.validate({ schema: createUserAnswerValidator, data: request.all() })

    return this.createUserAnswer.create(payload)
  }
}
