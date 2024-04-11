import { inject } from '@adonisjs/core'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { Id } from '#shared/id/domain/models/id'
import { QuizNotFoundException } from '#quiz/domain/models/quiz/quiz_not_found.exception'
import { QuestionFactory } from '#quiz/domain/factories/question.factory'
import { Quiz, UpdateQuizDto } from '#quiz/domain/models/quiz/quiz'

@inject()
export class UpdateQuizService {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async execute(quizId: Id, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    const newQuiz = new Quiz({
      id: quiz.id,
      name: updateQuizDto.name ?? quiz.name,
      questions: updateQuizDto.questions
        ? updateQuizDto.questions.map((q) => QuestionFactory.create(q))
        : quiz.questions,
    })

    return this.quizzesRepository.save(newQuiz)
  }
}
