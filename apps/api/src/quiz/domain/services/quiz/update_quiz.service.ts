import { Quiz, UpdateQuizDto } from '../../models/quiz/quiz.js'
import { Id } from '../../../../shared/id/domain/models/id.js'
import { IQuizzesRepository } from '../../contracts/quizzes.repository.js'
import { QuestionFactory } from '../../factories/question.factory.js'
import { inject } from '@adonisjs/core'
import { QuizNotFoundException } from '../../models/quiz/quiz_not_found.exception.js'

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
