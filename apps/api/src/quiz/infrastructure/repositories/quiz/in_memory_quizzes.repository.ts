import { Quiz } from '../../../domain/models/quiz/quiz.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { IQuizzesRepository } from '../../../domain/contracts/quizzes.repository.js'

export class InMemoryQuizzesRepository implements IQuizzesRepository {
  private quizzes: Record<string, Quiz> = {}

  async save(quiz: Quiz): Promise<Quiz> {
    this.quizzes[quiz.id.toString()] = quiz
    return quiz
  }

  async getById(quizId: Id): Promise<Quiz | null> {
    return this.quizzes[quizId.toString()] ?? null
  }

  async getAll(): Promise<Quiz[]> {
    return Object.values(this.quizzes)
  }

  async deleteById(quizId: Id): Promise<void> {
    delete this.quizzes[quizId.toString()]
  }

  async empty(): Promise<void> {
    this.quizzes = {}
  }
}