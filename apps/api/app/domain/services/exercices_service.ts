import { Question } from '../models/question.js'
import { Exercice, CreateExerciceDto, UpdateExerciceDto } from '../models/exercice.js'
import { ExerciceFeature as ExerciceFeature } from '#domainPorts/in/exercice_feature'
import { IExercicesRepository as IExercicesRepository } from '#domainPorts/out/exercices_repository'
import { inject } from '@adonisjs/core'

@inject()
export class ExercicesService implements ExerciceFeature {
  constructor(private readonly exercicesRepository: IExercicesRepository) {}

  async getExercice(quizId: string): Promise<Exercice | null> {
    return this.exercicesRepository.getById(quizId)
  }
  async getExercices(): Promise<Exercice[]> {
    return this.exercicesRepository.getAll()
  }

  async saveExercice(createExerciceDto: CreateExerciceDto): Promise<Exercice> {
    const questions = createExerciceDto.questions.map(
      (question) => new Question({ type: question.type })
    )
    const quiz = new Exercice({ name: createExerciceDto.name, questions })

    return this.exercicesRepository.store(quiz)
  }

  async updateExercice(quizId: string, updateExerciceDto: UpdateExerciceDto): Promise<Exercice> {
    const quiz = await this.exercicesRepository.getById(quizId)

    if (!quiz) {
      throw new Error('Quiz not found')
    }

    const newQuestions = updateExerciceDto.questions
      ? updateExerciceDto.questions.map((question) => new Question({ type: question.type }))
      : null

    const newQuiz = new Exercice({
      ...quiz,
      ...(updateExerciceDto.name ? { name: updateExerciceDto.name } : {}),
      ...(newQuestions ? { questions: newQuestions } : {}),
    })

    return this.exercicesRepository.update(newQuiz)
  }
}
