import { CreateQuestionDto, IExercicesManager } from '#domain/api/exercices_manager.interface'
import { IQuestionsRepository } from '../spi/questions.repository.js'
import { QuestionQcm } from './question.js'
import { IQuestion } from './types.js'

export class ExercicesManager implements IExercicesManager {
  constructor(private readonly questionsRepository: IQuestionsRepository) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<IQuestion> {
    const { content } = createQuestionDto
    let question: IQuestion
    if (content.type === 'qcm') {
      question = QuestionQcm.create(content)
    } else {
      throw new Error('Question type not supported')
    }
    return this.questionsRepository.createQuestion(question)
  }

  async getQuestion(id: string): Promise<IQuestion | null> {
    return this.questionsRepository.findQuestion(id)
  }

  async getQuestions(): Promise<IQuestion[]> {
    return this.questionsRepository.findQuestions()
  }
}
