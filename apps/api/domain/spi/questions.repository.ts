import { IQuestion } from '#domain/exercice/types'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IQuestionsRepository {
  findQuestions(): Promise<IQuestion[]>
  findQuestion(id: string): Promise<IQuestion | null>
  createQuestion(question: IQuestion): Promise<IQuestion>
}
