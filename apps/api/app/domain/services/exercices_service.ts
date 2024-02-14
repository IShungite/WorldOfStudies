import { ExerciceFeature } from '#domainPorts/in/exercice_feature'
import { IExercicesRepository } from '#domainPorts/out/exercices_repository'
import { inject } from '@adonisjs/core'
import { QuestionFactory } from '../factories/question_factory.js'
import { Exercice, UpdateExerciceDto } from '../models/exercice.js'

@inject()
export class ExercicesService implements ExerciceFeature {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async getExercice(exerciceId: string): Promise<Exercice | null> {
    return this.exercicesRepository.getById(exerciceId)
  }
  async getExercices(): Promise<Exercice[]> {
    return this.exercicesRepository.getAll()
  }

  async saveExercice(exercice: Exercice): Promise<Exercice> {
    return this.exercicesRepository.store(exercice)
  }

  async updateExercice(
    exerciceId: string,
    updateExerciceDto: UpdateExerciceDto
  ): Promise<Exercice> {
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

    return this.exercicesRepository.update(newExercice)
  }

  async deleteExercice(exerciceId: string): Promise<void> {
    console.log(exerciceId)
    const exercice = await this.exercicesRepository.getById(exerciceId)

    console.log(exercice)
    if (!exercice) {
      throw new Error('Exercice not found')
    }

    await this.exercicesRepository.deleteById(exerciceId)
  }
}
