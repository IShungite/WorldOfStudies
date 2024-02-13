import { Question } from '#domain/question'
import { IQuestionsRepository } from '#port/out/questions_repository'

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  private questions: Record<string, Question> = {}
  async store(question: Question): Promise<void> {
    this.questions[question.id] = question
  }
}
