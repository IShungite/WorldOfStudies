import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import { Quiz } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { Id } from '#shared/id/domain/models/id'
import { subjects } from '#database/seeders/1_subject_seeder'

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IQuizzesRepository)

    const quizzes: Quiz[] = [
      QuizFactory.create({
        name: 'Quiz 1',
        subjectId: subjects[0].id,
        questions: [
          {
            id: new Id('1'),
            type: 'qcm',
            choices: [
              { id: new Id('1'), label: 'Choice 1', isCorrect: true },
              { id: new Id('2'), label: 'Choice 2', isCorrect: true },
              { id: new Id('3'), label: 'Choice 3', isCorrect: true },
            ],
            points: 1,
          },
          {
            id: new Id('2'),
            type: 'qcm',
            choices: [
              { id: new Id('1'), label: 'Choice 1', isCorrect: true },
              { id: new Id('2'), label: 'Choice 2', isCorrect: true },
              { id: new Id('3'), label: 'Choice 3', isCorrect: true },
            ],
            points: 1,
          },
          {
            id: new Id('3'),
            type: 'text-hole',
            text: 'Here you can find activities to practise your reading skills. Reading will @@ you to improve your understanding of @@ language and build your vocabulary.',
            answers: ['help', 'the'],
            points: 2,
          },
        ],
      }),
    ]

    await Promise.all(quizzes.map((quiz) => repo.save(quiz)))
  }
}
