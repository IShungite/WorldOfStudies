import { CreateQuestionDto } from '#domain/api/exercices_manager.interface'
import { ExercicesManager } from '#domain/exercice/exercices_manager'
import { QuestionsRepository } from '#domain/exercice/questions_repository'
import { IQuestion } from '#domain/exercice/types'

export default class QuestionsServices {
  exercicesManager = new ExercicesManager(new QuestionsRepository())

  async getQuestions(): Promise<IQuestion[]> {
    return this.exercicesManager.getQuestions()
  }

  async getQuestion(id: string): Promise<IQuestion | null> {
    return this.exercicesManager.getQuestion(id)
  }

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<IQuestion> {
    return this.exercicesManager.createQuestion(createQuestionDto)
  }
}
