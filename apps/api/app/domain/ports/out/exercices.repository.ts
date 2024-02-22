import { Exercice } from '#domainModels/exercice/exercice'
import { Id } from '#domainModels/id'

export abstract class IExercicesRepository {
  abstract store(exercice: Exercice): Promise<Exercice>
  abstract getById(exerciceId: Id): Promise<Exercice | null>
  abstract getAll(): Promise<Exercice[]>
  abstract deleteById(exerciceId: Id): Promise<void>
}
