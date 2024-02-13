import { Question } from '../models/question.js'
import { Quiz, CreateQuizDto, UpdateQuizDto } from '../models/quiz.js'
import { QuizFeature } from '#domainPorts/in/quiz_feature'
import { IQuizzesRepository } from '#domainPorts/out/quizzes_repository'
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
    const questions = createQuizDto.questions.map(
      (question) => new Question({ type: question.type })
    )
    const quiz = new Quiz({ name: createQuizDto.name, questions })

    return this.quizzesRepository.store(quiz)
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new Error('Quiz not found')
    }

    const newQuestions = updateQuizDto.questions
      ? updateQuizDto.questions.map((question) => new Question({ type: question.type }))
      : null

    const newQuiz = new Quiz({
      ...quiz,
      ...(updateQuizDto.name ? { name: updateQuizDto.name } : {}),
      ...(newQuestions ? { questions: newQuestions } : {}),
    })

    return this.quizzesRepository.update(newQuiz)
  }
}
