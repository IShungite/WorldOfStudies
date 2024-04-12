import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { getFullUrl } from '#shared/infra/api/utils/get_url'

export class QuizApiMapper {
  static toResponse(quiz: Quiz) {
    return {
      result: {
        id: quiz.id.toString(),
        name: quiz.name,
        questions: quiz.questions.map((question) => QuestionApiMapper.toResponse(question)),
      },
      _links: this.getLinks(quiz),
    }
  }

  private static getLinks(quiz: Quiz) {
    const links: Record<string, string> = {
      user_answers: getFullUrl(`/api/quizzes/${quiz.id.toString()}/user-answers`),
    }
    return links
  }
}
