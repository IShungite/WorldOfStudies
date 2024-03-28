import { CreateQuizDto, Quiz } from '#domain/models/quiz/quiz'
import { QuestionFactory } from '#domain/factories/question.factory'

export class QuizFactory {
  static create(createQuiz: CreateQuizDto): Quiz {
    const questions = createQuiz.questions.map((question) => QuestionFactory.create(question))

    const quiz = new Quiz({
      ...createQuiz,
      questions,
    })

    return quiz
  }
}
