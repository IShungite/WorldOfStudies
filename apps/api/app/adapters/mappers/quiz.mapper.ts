import { Quiz } from '#domainModels/quiz/quiz'
import { QuestionMapper } from '#mappers/question.mapper'

export class QuizMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionMapper.toResponse(question)),
    }
  }
}
