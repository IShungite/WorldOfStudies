import { Question } from '#domainModels/question'

export abstract class IQuestionsRepository {
  abstract store(question: Question): Promise<void>
}
