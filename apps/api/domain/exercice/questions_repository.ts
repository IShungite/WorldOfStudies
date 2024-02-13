import { CreateQuestionDto } from '#domain/api/exercices_manager.interface'
import { IQuestionsRepository } from '#domain/spi/questions.repository'
import { IQuestion } from './types.js'

export class QuestionsRepository implements IQuestionsRepository {
  findQuestions(): Promise<IQuestion[]> {
    throw new Error('Method not implemented.')
  }
  findQuestion(id: string): Promise<IQuestion | null> {
    throw new Error('Method not implemented.')
  }
  createQuestion(createQuestionDto: CreateQuestionDto): Promise<IQuestion> {
    throw new Error('Method not implemented.')
  }
}
