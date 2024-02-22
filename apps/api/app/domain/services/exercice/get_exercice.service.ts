import { Exercice } from '#domainModels/exercice/exercice'
import { Id } from '#domainModels/id'
import { GetExerciceUseCase } from '#domainPorts/in/exercice/get_exercice.use_case'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetExerciceService implements GetExerciceUseCase {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async get(exerciceId: Id): Promise<Exercice | null> {
    return this.exercicesRepository.getById(exerciceId)
  }
}
