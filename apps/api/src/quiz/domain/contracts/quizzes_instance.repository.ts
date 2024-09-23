import { QuizInstance } from '#quiz/domain/models/quiz/quiz_instance'
import { Id } from '#shared/id/domain/models/id'
import { ClearableRepository } from '#shared/infra/storage/clearable_repository'

export abstract class IQuizzesInstanceRepository implements ClearableRepository {
  abstract save(quizInstance: QuizInstance): Promise<QuizInstance>
  abstract getById(id: Id): Promise<QuizInstance | null>
  abstract getByQuizIdAndCharacterId(quizId: Id, characterId: Id): Promise<QuizInstance | null>
  abstract getQuizzesByCharacterId(characterId: Id): Promise<QuizInstance[]>
  abstract empty(): Promise<void>
}
