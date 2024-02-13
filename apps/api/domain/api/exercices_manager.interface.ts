import {
  CreateQuestionHoleTextContentDto,
  CreateQuestionQcmContentDto,
  IQuestion,
} from '#domain/exercice/types'
import Question from '#models/question'

export interface CreateQuestionDto {
  content: CreateQuestionQcmContentDto | CreateQuestionHoleTextContentDto
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IExercicesManager {
  createQuestion(createQuestionDto: CreateQuestionDto): Promise<IQuestion>
  getQuestion(id: string): Promise<IQuestion | null>
  getQuestions(): Promise<IQuestion[]>
}
