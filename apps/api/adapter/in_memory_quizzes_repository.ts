import { Quiz } from '#domain/quiz'
import { IQuizzesRepository } from '#port/out/quizzes_repository'

export class InMemoryQuizRepository implements IQuizzesRepository {
  private quizzes: Record<string, Quiz> = {}

  async store(quiz: Quiz): Promise<Quiz> {
    this.quizzes[quiz.id] = quiz
    return quiz
  }

  async update(quiz: Quiz): Promise<Quiz> {
    this.quizzes[quiz.id] = quiz
    return quiz
  }

  async getById(quizId: string): Promise<Quiz | null> {
    return this.quizzes[quizId] ?? null
  }

  async getAll(): Promise<Quiz[]> {
    return Object.values(this.quizzes)
  }
}
