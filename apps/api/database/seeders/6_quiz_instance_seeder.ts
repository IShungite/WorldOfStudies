import { character1 } from '#database/seeders/3_character_seeder'
import { quizMaths, quizScience } from '#database/seeders/5_quiz_seeder'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstance, QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'
import { Id } from '#shared/id/domain/models/id'

import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export const quizInstances: QuizInstance[] = [
  new QuizInstance({
    id: new Id('1'),
    characterId: character1.id,
    quiz: quizScience,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    id: new Id('2'),
    characterId: character1.id,
    quiz: quizMaths,
    userAnswers: [],
    status: QuizInstanceStatus.IN_PROGRESS,
  }),
]

export const quizInstance1 = quizInstances[0]
export const quizInstance2 = quizInstances[1]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IQuizzesInstanceRepository)
    await Promise.all(quizInstances.map((quizInstance) => repo.save(quizInstance)))
  }
}
