import { Quiz } from '#domain/quiz'

export abstract class IQuizzesRepository {
  abstract store(quiz: Quiz): Promise<Quiz>
  abstract update(quiz: Quiz): Promise<Quiz>
  abstract getById(quizId: string): Promise<Quiz | null>
  abstract getAll(): Promise<Quiz[]>
}
