import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import vine from '@vinejs/vine'
import { GetUserAnswersByQuizInstanceService } from '#quiz/domain/services/user_answer/get_user_answers_by_quiz_instance.service'
import { UserAnswerApiMapper } from '#quiz/infrastructure/mappers/user_answer_api.mapper'

@inject()
export default class GetUserAnswersByQuizInstanceController {
  constructor(
    private readonly getUserAnswersByQuizInstanceService: GetUserAnswersByQuizInstanceService
  ) {}

  async handle({ params }: HttpContext) {
    const quizInstanceId = await vine.validate({
      schema: domainIdValidator,
      data: params.quizInstanceId,
    })

    const userAnswers = await this.getUserAnswersByQuizInstanceService.execute(quizInstanceId)

    return userAnswers.map((userAnswer) => UserAnswerApiMapper.toResponse(userAnswer))
  }
}
