import { IQuestionsRepository } from '#domainPorts/out/questions_repository'

export class QuestionsService {
  constructor(private readonly questionsRepository: IQuestionsRepository) {}
}
