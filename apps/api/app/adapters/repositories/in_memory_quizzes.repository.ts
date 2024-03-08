import { Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'

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
}
