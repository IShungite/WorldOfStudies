import { StartQuizService } from '#quiz/domain/services/quiz/start_quiz.service'
import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { startQuizValidator } from '#quiz/infrastructure/validators/start_quiz.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { StartQuizResponse } from '@world-of-studies/api-types'

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

    const quizInstance = await this.startQuizService.execute(quizId, characterId)

    const responseBody: StartQuizResponse = {
      result: {
        quizInstanceId: quizInstance.id.toString(),
        questions: quizInstance.quiz.questions.map((question) => ({
          isAnswered: !!quizInstance.userAnswers.find((userAnswer) =>
            userAnswer.questionId.equals(question.id)
          ),
          question: QuestionApiMapper.toResponse(question),
        })),
      },
    }

    return response.ok(responseBody)
  }
}
