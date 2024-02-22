import { Exercice } from '#domainModels/exercice/exercice'

export interface GetExercicesUseCase {
  getAll(): Promise<Exercice[]>
}
