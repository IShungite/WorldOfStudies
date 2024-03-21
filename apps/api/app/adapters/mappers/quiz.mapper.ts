import { Quiz } from '#domainModels/quiz/quiz'
import { QuestionMapper } from '#mappers/question.mapper'
import QuizEntity from '#models/quiz'
import { Id } from '#domainModels/id/id'

export class QuizMapper {
  static toResponse(quiz: Quiz) {
    return {
      id: quiz.id.toString(),
      name: quiz.name,
      questions: quiz.questions.map((question) => QuestionMapper.toResponse(question)),
    }
  }

  static fromAdonis(quizEntity: QuizEntity): Quiz {
    return new Quiz({
      id: new Id(quizEntity.id.toString()),
      name: quizEntity.name,
      questions: quizEntity.questions.map((question) => QuestionMapper.fromAdonis(question)),
    })
  }
}
