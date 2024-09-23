import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { ExamQuiz } from '#quiz/domain/models/quiz/exam_quiz'
import { OnlyOneAttemptPerExamQuizException } from '#quiz/domain/models/quiz/exceptions/only_one_attempt_per_exam_quiz.exception'
import { QuizNotFoundException } from '#quiz/domain/models/quiz/exceptions/quiz_not_found.exception'
import { PracticeQuiz } from '#quiz/domain/models/quiz/practice_quiz'
import { QuizInstance, QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { Id } from '#shared/id/domain/models/id'
import { inject } from '@adonisjs/core'

@inject()
export class StartQuizService {
  constructor(
    private readonly quizzesRepository: IQuizzesRepository,
    private readonly quizzesInstanceRepository: IQuizzesInstanceRepository
  ) {}

  async execute(quizId: Id, characterId: Id): Promise<QuizInstance> {
    const { quiz, quizInstance } = await this.validate(quizId, characterId)

    if (quizInstance) {
      return quizInstance
    }

    const newQuizInstance = new QuizInstance({
      quiz,
      characterId,
      userAnswers: [],
      status: QuizInstanceStatus.IN_PROGRESS,
    })
    await this.quizzesInstanceRepository.save(newQuizInstance)

    return newQuizInstance
  }

  private async validate(quizId: Id, characterId: Id) {
    const quiz = await this.quizzesRepository.getById(quizId)

    if (!quiz) {
      throw new QuizNotFoundException(quizId)
    }

    const quizInstance = await this.quizzesInstanceRepository.getByQuizIdAndCharacterId(
      quiz.id,
      characterId
    )

    const isExamQuiz = quizInstance && quiz instanceof ExamQuiz
    const isCompleted = quizInstance?.status === QuizInstanceStatus.COMPLETED
    if (isExamQuiz && isCompleted) {
      throw new OnlyOneAttemptPerExamQuizException()
    }

    const isPracticeQuiz = quizInstance && quiz instanceof PracticeQuiz
    if (isPracticeQuiz && !isCompleted) {
      return { quiz, quizInstance }
    }

    return { quiz }
  }
}
