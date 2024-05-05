import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'

export class QuizGameApiMapper {
  static toResponse(quizGame: QuizGame) {
    return {
      result: {
        id: quizGame.id.toString(),
        quizId: quizGame.quiz.id.toString(),
        characterId: quizGame.characterId.toString(),
      },
      _links: this.getLinks(quizGame),
    }
  }

  private static getLinks(quizGame: QuizGame) {
    const links: Record<string, string> = {
      answers: getFullUrl(
        `/api/quizzes/${quizGame.quiz.id.toString()}/games/${quizGame.id}/user-answers`
      ),
    }
    return links
  }
}
