import { QuizGame } from '#quiz/domain/models/quiz/quiz_game'
import { Id } from '#shared/id/domain/models/id'
import { ClearableRepository } from '#shared/infra/storage/clearable_repository'

export abstract class IQuizzesGameRepository implements ClearableRepository {
  abstract save(quizGame: QuizGame): Promise<QuizGame>
  abstract getByQuizIdAndCharacterId(quizId: Id, characterId: Id): Promise<QuizGame | null>
  abstract empty(): Promise<void>
}
