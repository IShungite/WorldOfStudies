import { GetQuizInstanceService } from '#quiz/domain/services/quiz/get_quiz_instance.service'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { UserStorageMapper } from '#user/infrastructure/mappers/user_storage.mapper'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { GetQuizInstanceStatsResponse } from '@world-of-studies/api-types'

@inject()
export default class GetQuizInstanceStatsController {
  constructor(private readonly getQuizInstanceService: GetQuizInstanceService) {}

  async handle({ response, params, auth }: HttpContext) {
    const userEntity = await auth.authenticate()
    const user = UserStorageMapper.fromLucid(userEntity)

    const quizInstanceId = await vine.validate({
      schema: domainIdValidator,
      data: params['quizInstanceId'],
    })

    const quizInstance = await this.getQuizInstanceService.execute(quizInstanceId, user.id)

    const responseBody: GetQuizInstanceStatsResponse = {
      result: quizInstance.getStats(),
    }

    return response.ok(responseBody)
  }
}
