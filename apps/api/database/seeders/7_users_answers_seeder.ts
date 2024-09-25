import { character1 } from '#database/seeders/3_character_seeder'
import { quizScience, quizMaths } from '#database/seeders/5_quiz_seeder'
import { quizInstance1, quizInstance2 } from '#database/seeders/6_quiz_instance_seeder'
import { IUserAnswersRepository } from '#quiz/domain/contracts/user_answers.repository'
import {
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'

import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IUserAnswersRepository)

    const userAnwsers: UserAnswer[] = [
      new UserAnswerQcm({
        id: new Id('1'),
        quizInstanceId: quizInstance1.id,
        questionId: quizScience.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        id: new Id('2'),
        quizInstanceId: quizInstance1.id,
        questionId: quizScience.questions[1].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        id: new Id('3'),
        quizInstanceId: quizInstance1.id,
        questionId: quizScience.questions[2].id,
        characterId: character1.id,
        values: ['1789', 'monarchie'],
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        id: new Id('4'),
        quizInstanceId: quizInstance2.id,
        questionId: quizMaths.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
    ]

    await Promise.all(userAnwsers.map((userAnswer) => repo.save(userAnswer)))
  }
}
