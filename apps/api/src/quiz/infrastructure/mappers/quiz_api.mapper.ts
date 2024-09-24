import { QuestionApiMapper } from '#quiz/infrastructure/mappers/question_api.mapper'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { getFullUrl } from '#shared/infra/api/utils/get_url'
import { ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'

export class QuizApiMapper {
  static toResponse(quiz: Quiz) {
    const isExam = quiz instanceof ExamQuiz
    return {
      result: {
        id: quiz.id.toString(),
        name: quiz.name,
        questions: quiz.questions.map((question) => QuestionApiMapper.toResponse(question)),
        type: isExam ? QuizType.EXAM : QuizType.PRACTICE,
        startAt: isExam ? quiz.startAt.toString() : null,
        endAt: isExam ? quiz.endAt.toString() : null,
      },
      _links: this.getLinks(quiz),
    }
  }

  private static getLinks(quiz: Quiz) {
    const links: Record<string, string> = {
      userAnswers: getFullUrl(`/api/quizzes/${quiz.id.toString()}/user-answers`),
    }
    return links
  }
}
