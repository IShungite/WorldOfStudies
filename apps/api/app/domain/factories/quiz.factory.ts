import { CreateQuizDto, Quiz } from '#domainModels/quiz/quiz'
import { QuestionFactory } from '#factories/question.factory'

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
