import { CreateQuizDto, Quiz } from '#quiz/domain/models/quiz/quiz'
import { QuestionFactory } from '#quiz/domain/factories/question.factory'

export class QuizFactory {
  static create(createQuiz: CreateQuizDto): Quiz {
    const questions = createQuiz.questions.map((question) => QuestionFactory.create(question))

    return new Quiz({
      ...createQuiz,
      questions,
    })
  }
}
