import { Quiz, UpdateQuizDto } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'
import { UpdateQuizUseCase } from '#domainPorts/in/quiz/update_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { QuestionFactory } from '#factories/question.factory'
import { inject } from '@adonisjs/core'
import { QuizNotFoundException } from '#domainModels/quiz/quiz_not_found.exception'

@inject()
export class UpdateQuizService implements UpdateQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async update(quizId: Id, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
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
