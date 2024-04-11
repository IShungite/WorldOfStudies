import { UserAnswer } from '../../domain/models/user_answer/user_answer.js'

export class UserAnswerApiMapper {
  static toResponse(userAnswer: UserAnswer) {
    return {
      id: userAnswer.id.toString(),
      type: userAnswer.type,
      characterId: userAnswer.characterId.toString(),
      questionId: userAnswer.questionId.toString(),
    }
  }
}
