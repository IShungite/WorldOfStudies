import { Id } from '#domainModels/id'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'

export interface DeleteExerciceUseCase {
  delete(exerciceId: Id): Promise<void>
}
