import { IQuestionsRepository } from '#port/out/questions_repository'

export class QuestionsService {
  constructor(private readonly questionsRepository: IQuestionsRepository) {}
}
