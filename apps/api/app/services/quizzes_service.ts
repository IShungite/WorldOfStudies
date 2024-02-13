import { Question } from '#domain/question'
import { CreateQuizDto, Quiz, UpdateQuizDto } from '#domain/quiz'
import { QuizFeature } from '#port/in/quiz_feature'
import { IQuizzesRepository } from '#port/out/quizzes_repository'
import { inject } from '@adonisjs/core'

@inject()
export class QuizzesService implements QuizFeature {
  constructor(private readonly quizzesRepository: IQuizzesRepository) {}

  async getQuiz(quizId: string): Promise<Quiz | null> {
    return this.quizzesRepository.getById(quizId)
  }
  async getQuizzes(): Promise<Quiz[]> {
    return this.quizzesRepository.getAll()
  }

  async saveQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const questions = createQuizDto.questions.map((question) => new Question(question.type))
    const quiz = new Quiz(createQuizDto.name, questions)

    return this.quizzesRepository.store(quiz)
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new Error('Quiz not found')
    }

    const questions = updateQuizDto.questions
      ? updateQuizDto.questions.map((question) => new Question(question.type))
      : quiz.questions

    const newQuiz = new Quiz(updateQuizDto.name ?? quiz.name, questions ?? quiz.questions, quiz.id)

    return this.quizzesRepository.update(newQuiz)
  }
}
