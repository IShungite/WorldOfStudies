import { CreateQuizDto, Quiz, UpdateQuizDto } from '#domain/quiz'

export interface QuizFeature {
  saveQuiz: (createQuizDto: CreateQuizDto) => Promise<Quiz>
  updateQuiz: (quizId: string, updateQuizDto: UpdateQuizDto) => Promise<Quiz>
  getQuiz: (quizId: string) => Promise<Quiz | null>
  getQuizzes: () => Promise<Quiz[]>
}
