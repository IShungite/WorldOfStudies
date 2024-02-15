import { Exercice } from '#domainModels/exercice'

export abstract class IExercicesRepository {
  abstract store(exercice: Exercice): Promise<Exercice>
  abstract getById(exerciceId: string): Promise<Exercice | null>
  abstract getAll(): Promise<Exercice[]>
  abstract deleteById(exerciceId: string): Promise<void>
}
