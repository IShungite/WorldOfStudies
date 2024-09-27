import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { StartQuizResponse } from '@world-of-studies/api-types'
import { GenerateIaQuizService } from '#quiz/domain/services/quiz/generate_ia_quiz.service'
import { Id } from '#shared/id/domain/models/id'
import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { QuizApiMapper } from '#quiz/infrastructure/mappers/quiz_api.mapper'

@inject()
export default class GetCharacterQuizzesController {
  constructor(private readonly generateIaQuizService: GenerateIaQuizService) {}

  async handle({ request, response, auth }: HttpContext) {
    await auth.authenticate()

    const param = request.all()

    const charId = new Id(param['characterId'])
    const iaParam = param['data']

    const quizInstance = await this.generateIaQuizService.execute(iaParam, charId)
    //
    // const responseBody: StartQuizResponse = {
    //   result: {
    //     quizInstanceId: quizInstance.id.toString(),
    //     questions: quizInstance.quiz.questions.map((question) => ({
    //       isAnswered: !!quizInstance.userAnswers.find((userAnswer) =>
    //         userAnswer.questionId.equals(question.id)
    //       ),
    //       question: QuestionApiMapper.toResponse(question),
    //     })),
    //   },
    // }

    return response.ok(QuizApiMapper.toResponse(quizInstance))
  }
}
