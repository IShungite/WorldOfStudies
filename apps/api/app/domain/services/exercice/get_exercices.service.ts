import { Exercice } from '#domainModels/exercice/exercice'
import { GetExercicesUseCase } from '#domainPorts/in/exercice/get_exercices.use_case'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { inject } from '@adonisjs/core'

@inject()
export class GetExercicesService implements GetExercicesUseCase {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async getAll(): Promise<Exercice[]> {
    return this.exercicesRepository.getAll()
  }
}
