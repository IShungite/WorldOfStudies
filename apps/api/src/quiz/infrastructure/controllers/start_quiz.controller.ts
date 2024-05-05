import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { StartQuizService } from '#quiz/domain/services/quiz/start_quiz.service'
import { startQuizValidator } from '#quiz/infrastructure/validators/start_quiz.validator'
import { QuizGameApiMapper } from '#quiz/infrastructure/mappers/quiz_game_api.mapper'

@inject()
export default class StartQuizController {
  constructor(private readonly startQuizService: StartQuizService) {}

  async handle({ request, response, auth }: HttpContext) {
    await auth.authenticate()

    const [quizId, { characterId }] = await Promise.all([
      vine.validate({
        schema: domainIdValidator,
        data: request.param('quizId'),
      }),
      vine.validate({
        schema: startQuizValidator,
        data: request.body(),
      }),
    ])

    const quizGame = await this.startQuizService.execute(quizId, characterId)
    return response.ok(QuizGameApiMapper.toResponse(quizGame))
  }
}
