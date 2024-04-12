import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

export class QuizApiMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionApiMapper.toResponse(question)),
    }
  }
}
