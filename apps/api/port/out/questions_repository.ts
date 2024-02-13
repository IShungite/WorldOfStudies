import { Question } from '#domain/question'

export abstract class IQuestionsRepository {
  abstract store(question: Question): Promise<void>
}
