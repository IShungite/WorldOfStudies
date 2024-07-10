import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'

export abstract class IUserAnswersRepository {
  abstract save(userAnswer: UserAnswer): Promise<UserAnswer>
  abstract getAllByQuizInstanceId(quizInstanceId: Id): Promise<UserAnswer[]>
  abstract empty(): Promise<void>
}
