import { Exercice } from '#domainModels/exercice'
import { IExercicesRepository } from '#domainPorts/out/exercices_repository'

export class InMemoryExercicesRepository implements IExercicesRepository {
  private quizzes: Record<string, Exercice> = {}

  async store(quiz: Exercice): Promise<Exercice> {
    this.quizzes[quiz.id] = quiz
    return quiz
  }

  async update(quiz: Exercice): Promise<Exercice> {
    this.quizzes[quiz.id] = quiz
    return quiz
  }

  async getById(quizId: string): Promise<Exercice | null> {
    return this.quizzes[quizId] ?? null
  }

  async getAll(): Promise<Exercice[]> {
    return Object.values(this.quizzes)
  }
}
