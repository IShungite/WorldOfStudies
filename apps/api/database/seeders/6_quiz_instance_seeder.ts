import { character1 } from '#database/seeders/3_character_seeder'
import {
  controleGeographie,
  controleHistoire,
  controleScience,
  quizAnglais,
  quizGeographie,
  quizHistoire,
  quizMaths,
  quizScience,
} from '#database/seeders/5_quiz_seeder'
import { IQuizzesInstanceRepository } from '#quiz/domain/contracts/quizzes_instance.repository'
import { QuizInstance, QuizInstanceStatus } from '#quiz/domain/models/quiz/quiz_instance'

import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export const quizInstances: QuizInstance[] = [
  new QuizInstance({
    characterId: character1.id,
    quiz: quizHistoire,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: quizGeographie,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: quizScience,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: quizMaths,
    userAnswers: [],
    status: QuizInstanceStatus.IN_PROGRESS,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: quizAnglais,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: controleHistoire,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: controleGeographie,
    userAnswers: [],
    status: QuizInstanceStatus.COMPLETED,
  }),
  new QuizInstance({
    characterId: character1.id,
    quiz: controleScience,
    userAnswers: [],
    status: QuizInstanceStatus.IN_PROGRESS,
  }),
]

export const quizInstanceHistoire = quizInstances[0]
export const quizInstanceGeographie = quizInstances[1]
export const quizInstanceScience = quizInstances[2]
export const quizInstanceMaths = quizInstances[3]
export const quizInstanceAnglais = quizInstances[4]
export const controleInstanceHistoire = quizInstances[5]
export const controleInstanceGeographie = quizInstances[6]
export const controleInstanceScience = quizInstances[7]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IQuizzesInstanceRepository)
    await Promise.all(quizInstances.map((quizInstance) => repo.save(quizInstance)))
  }
}
