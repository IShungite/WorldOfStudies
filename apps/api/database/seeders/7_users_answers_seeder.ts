import { character1 } from '#database/seeders/3_character_seeder'
import {
  quizScience,
  quizMaths,
  quizHistoire,
  quizGeographie,
  quizAnglais,
  controleHistoire,
  controleGeographie,
  controleScience,
} from '#database/seeders/5_quiz_seeder'
import {
  controleInstanceGeographie,
  controleInstanceHistoire,
  controleInstanceScience,
  quizInstanceAnglais,
  quizInstanceGeographie,
  quizInstanceHistoire,
  quizInstanceMaths,
  quizInstanceScience,
} from '#database/seeders/6_quiz_instance_seeder'
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
      // Quiz Histoire
      new UserAnswerQcm({
        quizInstanceId: quizInstanceHistoire.id,
        questionId: quizHistoire.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: quizInstanceHistoire.id,
        questionId: quizHistoire.questions[1].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: quizInstanceHistoire.id,
        questionId: quizGeographie.questions[2].id,
        characterId: character1.id,
        values: ['1789', 'monarchie'],
        createdAt: new Date(),
      }),
      // Quiz Geographie
      new UserAnswerQcm({
        quizInstanceId: quizInstanceGeographie.id,
        questionId: quizGeographie.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: quizInstanceGeographie.id,
        questionId: quizGeographie.questions[1].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: quizInstanceGeographie.id,
        questionId: quizHistoire.questions[2].id,
        characterId: character1.id,
        values: ['France'],
        createdAt: new Date(),
      }),
      // Quiz Science
      new UserAnswerQcm({
        quizInstanceId: quizInstanceScience.id,
        questionId: quizScience.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: quizInstanceScience.id,
        questionId: quizScience.questions[1].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: quizInstanceScience.id,
        questionId: quizScience.questions[2].id,
        characterId: character1.id,
        values: ['bobby', 'bricolage'],
        createdAt: new Date(),
      }),
      // Quiz Maths
      new UserAnswerQcm({
        quizInstanceId: quizInstanceMaths.id,
        questionId: quizMaths.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      // Quiz Anglais
      new UserAnswerQcm({
        quizInstanceId: quizInstanceAnglais.id,
        questionId: quizAnglais.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: quizInstanceAnglais.id,
        questionId: quizAnglais.questions[1].id,
        characterId: character1.id,
        choiceId: new Id('2'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: quizInstanceAnglais.id,
        questionId: quizAnglais.questions[2].id,
        characterId: character1.id,
        values: ['sun'],
        createdAt: new Date(),
      }),
      // Controle Histoire
      new UserAnswerQcm({
        quizInstanceId: controleInstanceHistoire.id,
        questionId: controleHistoire.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: controleInstanceHistoire.id,
        questionId: controleHistoire.questions[1].id,
        characterId: character1.id,
        values: ['Waterloo'],
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: controleInstanceHistoire.id,
        questionId: controleHistoire.questions[2].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: controleInstanceHistoire.id,
        questionId: controleHistoire.questions[3].id,
        characterId: character1.id,
        values: ['1939'],
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: controleInstanceHistoire.id,
        questionId: controleHistoire.questions[4].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      // Controle Geographie
      new UserAnswerQcm({
        quizInstanceId: controleInstanceGeographie.id,
        questionId: controleGeographie.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('3'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: controleInstanceGeographie.id,
        questionId: controleGeographie.questions[1].id,
        characterId: character1.id,
        values: ['Himalaya'],
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: controleInstanceGeographie.id,
        questionId: controleGeographie.questions[2].id,
        characterId: character1.id,
        choiceId: new Id('3'),
        createdAt: new Date(),
      }),
      new UserAnswerQcm({
        quizInstanceId: controleInstanceGeographie.id,
        questionId: controleGeographie.questions[3].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
      new UserAnswerTextHole({
        quizInstanceId: controleInstanceGeographie.id,
        questionId: controleGeographie.questions[4].id,
        characterId: character1.id,
        values: ['Nil'],
        createdAt: new Date(),
      }),
      // Controle Science
      new UserAnswerQcm({
        quizInstanceId: controleInstanceScience.id,
        questionId: controleScience.questions[0].id,
        characterId: character1.id,
        choiceId: new Id('1'),
        createdAt: new Date(),
      }),
    ]

    await Promise.all(userAnwsers.map((userAnswer) => repo.save(userAnswer)))
  }
}
