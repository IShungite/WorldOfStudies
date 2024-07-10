import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'

export class UserAnswerApiMapper {
  static toResponse(userAnswer: UserAnswer) {
    return {
      result: {
        id: userAnswer.id.toString(),
        type: userAnswer.type,
        characterId: userAnswer.characterId.toString(),
        questionId: userAnswer.questionId.toString(),
        quizInstanceId: userAnswer.quizInstanceId.toString(),
      },
    }
  }
}
