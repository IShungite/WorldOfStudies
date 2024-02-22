import { ExerciceFeature } from '#domainPorts/in/exercice.feature'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { inject } from '@adonisjs/core'
import { QuestionFactory } from '../factories/question.factory.js'
import { Exercice, UpdateExerciceDto } from '../models/exercice.js'
import { Id } from '#domainModels/id'

@inject()
export class ExercicesService implements ExerciceFeature {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async getExercice(exerciceId: Id): Promise<Exercice | null> {
    return this.exercicesRepository.getById(exerciceId)
  }
  async getExercices(): Promise<Exercice[]> {
    return this.exercicesRepository.getAll()
  }

  async createExercice(exercice: Exercice): Promise<Exercice> {
    return this.exercicesRepository.store(exercice)
  }

  async updateExercice(exerciceId: Id, updateExerciceDto: UpdateExerciceDto): Promise<Exercice> {
    const exercice = await this.exercicesRepository.getById(exerciceId)

    if (!exercice) {
      throw new Error('Exercice not found')
    }

    const newExercice = new Exercice({
      id: exercice.id,
      name: updateExerciceDto.name ?? exercice.name,
      questions: updateExerciceDto.questions
        ? updateExerciceDto.questions.map((q) => QuestionFactory.create(q))
        : exercice.questions,
    })

    return this.exercicesRepository.store(newExercice)
  }

  async deleteExercice(exerciceId: Id): Promise<void> {
    const exercice = await this.exercicesRepository.getById(exerciceId)

    if (!exercice) {
      throw new Error('Exercice not found')
    }

    await this.exercicesRepository.deleteById(exerciceId)
  }
}
