import { UserAnswer } from '#domainModels/quiz/user_answer'

export class UserAnswerMapper {
  static toResponse(userAnswer: UserAnswer) {
    return {
      id: userAnswer.id.toString(),
      type: userAnswer.type,
      characterId: userAnswer.characterId.toString(),
      questionId: userAnswer.questionId.toString(),
    }
  }
}
