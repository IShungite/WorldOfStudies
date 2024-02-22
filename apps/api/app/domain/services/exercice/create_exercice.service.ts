import { CreateExerciceDto, Exercice } from '#domainModels/exercice/exercice'
import { CreateExerciceUseCase } from '#domainPorts/in/exercice/create_exercice.use_case'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { ExerciceFactory } from '#factories/exercice.factory'
import { inject } from '@adonisjs/core'

@inject()
export class CreateExerciceService implements CreateExerciceUseCase {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async create(createExerciceDto: CreateExerciceDto): Promise<Exercice> {
    const exercice = ExerciceFactory.create(createExerciceDto)

    return this.exercicesRepository.store(exercice)
  }
}
