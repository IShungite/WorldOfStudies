import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'

export class QuizInstanceApiMapper {
  static toResponse(quizInstance: QuizInstance) {
    return {
      result: {
        id: quizInstance.id.toString(),
        quizId: quizInstance.quiz.id.toString(),
        characterId: quizInstance.characterId.toString(),
      },
      _links: this.getLinks(quizInstance),
    }
  }

  private static getLinks(quizInstance: QuizInstance) {
    const links: Record<string, string> = {
      answers: getFullUrl(
        `/api/quizzes/${quizInstance.quiz.id.toString()}/games/${quizInstance.id}/user-answers`
      ),
    }
    return links
  }
}
