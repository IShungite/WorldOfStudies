import { IQuestion, IQuestionsRepository } from './types.js'

export class QuestionsManager {
  constructor(private readonly questionsRepository: IQuestionsRepository) {}

  private async getQuestions(): Promise<IQuestion[]> {
    return this.questionsRepository.getQuestions()
  }
}
