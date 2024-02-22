import { Exercice } from '#domainModels/exercice/exercice'
import { Id } from '#domainModels/id'

export interface GetExerciceUseCase {
  get(exerciceId: Id): Promise<Exercice | null>
}
