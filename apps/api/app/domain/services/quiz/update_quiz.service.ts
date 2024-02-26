import { Quiz, UpdateQuizDto } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id'
import { UpdateQuizUseCase } from '#domainPorts/in/quiz/update_quiz.use_case'
import { IQuizzesRepository } from '#domainPorts/out/quizzes.repository'
import { QuestionFactory } from '#factories/question.factory'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateQuizService implements UpdateQuizUseCase {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async update(quizId: Id, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new Error('Quiz not found')
    }

    const newQuiz = new Quiz({
      id: quiz.id,
      name: updateQuizDto.name ?? quiz.name,
      questions: updateQuizDto.questions
        ? updateQuizDto.questions.map((q) => QuestionFactory.create(q))
        : quiz.questions,
    })

    return this.quizzesRepository.store(newQuiz)
  }
}
