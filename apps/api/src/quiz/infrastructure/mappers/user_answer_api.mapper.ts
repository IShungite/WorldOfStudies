import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { getFullUrl } from '#shared/infra/api/utils/get_url'

export class UserAnswerApiMapper {
  static toResponse(userAnswer: UserAnswer) {
    return {
      result: {
        id: userAnswer.id.toString(),
        type: userAnswer.type,
        characterId: userAnswer.characterId.toString(),
        questionId: userAnswer.questionId.toString(),
      },
      _links: this.getLinks(userAnswer),
    }
  }

  private static getLinks(userAnswer: UserAnswer) {
    const links: Record<string, string> = {
      quiz: getFullUrl(`/api/quizzes/${userAnswer.quizId.toString()}`),
    }

    return links
  }
}
