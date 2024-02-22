import { Exercice, UpdateExerciceDto } from '#domainModels/exercice/exercice'
import { Id } from '#domainModels/id'
import { UpdateExerciceUseCase } from '#domainPorts/in/exercice/update_exercice.use_case'
import { IExercicesRepository } from '#domainPorts/out/exercices.repository'
import { QuestionFactory } from '#factories/question.factory'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateExerciceService implements UpdateExerciceUseCase {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async update(exerciceId: Id, updateExerciceDto: UpdateExerciceDto): Promise<Exercice> {
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
}
