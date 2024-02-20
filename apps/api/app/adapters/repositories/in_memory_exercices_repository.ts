import { Exercice } from '#domainModels/exercice'
import { Id } from '#domainModels/id'
import { IExercicesRepository } from '#domainPorts/out/exercices_repository'

export class InMemoryExercicesRepository implements IExercicesRepository {
  private quizzes: Record<string, Exercice> = {}

  async store(quiz: Exercice): Promise<Exercice> {
    this.quizzes[quiz.id.toString()] = quiz
    return quiz
  }

  async update(quiz: Exercice): Promise<Exercice> {
    this.quizzes[quiz.id.toString()] = quiz
    return quiz
  }

  async getById(quizId: Id): Promise<Exercice | null> {
    return this.quizzes[quizId.toString()] ?? null
  }

  async getAll(): Promise<Exercice[]> {
    return Object.values(this.quizzes)
  }

  async deleteById(quizId: Id): Promise<void> {
    delete this.quizzes[quizId.toString()]
  }
}
