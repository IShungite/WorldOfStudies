import { CreateBaseQuizDto, Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'

export type CreatePracticeQuizDto = CreateBaseQuizDto & {
  type: QuizType.PRACTICE
}

export class PracticeQuiz extends Quiz {}
