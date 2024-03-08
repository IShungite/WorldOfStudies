import { UpdateQuizDto, Quiz } from '#domainModels/quiz/quiz'
import { Id } from '#domainModels/id/id'

export interface UpdateQuizUseCase {
  update: (quizId: Id, updateQuizDto: UpdateQuizDto) => Promise<Quiz>
}
