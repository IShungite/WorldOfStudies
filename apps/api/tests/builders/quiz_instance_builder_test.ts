import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { QuizInstance, QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { UserAnswer } from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'
import { QuizBuilderTest } from '#tests/builders/quiz_builder_test'

export class QuizInstanceBuilderTest {
  private _quiz = new QuizBuilderTest().build()
  private _characterId: Id = Id.factory()
  private _userAnswers: UserAnswer[] = []
  private _status: QuizInstanceStatus = QuizInstanceStatus.IN_PROGRESS

  build(): QuizInstance {
    return new QuizInstance({
      quiz: this._quiz,
      characterId: this._characterId,
      userAnswers: this._userAnswers,
      status: this._status,
    })
  }

  withQuiz(quiz: Quiz): this {
    this._quiz = quiz
    return this
  }

  withCharacterId(characterId: Id): this {
    this._characterId = characterId
    return this
  }

  withStatus(status: QuizInstanceStatus): this {
    this._status = status
    return this
  }
}
