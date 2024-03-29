import { Quiz } from '#domain/models/quiz/quiz'
import { QuestionMapper } from '#infrastructure/mappers/question.mapper'
import QuizEntity from '#infrastructure/entities/quiz'
import { Id } from '#domain/models/id/id'

export class QuizMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionMapper.toResponse(question)),
    }
  }

  static toResponseList(quizzes: Quiz[]) {
    return quizzes.map((quiz) => {
      return QuizMapper.toResponse(quiz)
    })
  }

  static fromLucid(quizEntity: QuizEntity): Quiz {
    return new Quiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionMapper.fromLucid(question)),
    })
  }
}
