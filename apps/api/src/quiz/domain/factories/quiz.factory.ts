import { CreateQuizDto, Quiz } from '../models/quiz/quiz.js'
import { QuestionFactory } from './question.factory.js'

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
