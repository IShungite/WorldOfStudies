import { Id } from '#domainModels/id'
import { DeleteExerciceUseCase } from '#domainPorts/in/exercice/delete_exercice.use_case'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteExerciceService implements DeleteExerciceUseCase {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async delete(exerciceId: Id): Promise<void> {
    const exercice = await this.exercicesRepository.getById(exerciceId)

    if (!exercice) {
      throw new Error('Exercice not found')
    }

    await this.exercicesRepository.deleteById(exerciceId)
  }
}
