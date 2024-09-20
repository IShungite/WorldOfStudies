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
        name: 'Quiz Histoire',
        subjectId: subjects[2].id, // Histoire
        questions: [
          {
            id: new Id('1'),
            type: 'qcm',
            text: 'Quel événement a marqué le début de la Révolution française ?',
            choices: [
              { id: new Id('1'), label: 'La Prise de la Bastille', isCorrect: true },
              { id: new Id('2'), label: 'Le Sacre de Napoléon', isCorrect: false },
              { id: new Id('3'), label: "La Chute de l'Empire romain", isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('2'),
            type: 'qcm',
            text: 'Qui était le roi de France pendant la Révolution française ?',
            choices: [
              { id: new Id('1'), label: 'Louis XIV', isCorrect: false },
              { id: new Id('2'), label: 'Louis XVI', isCorrect: true },
              { id: new Id('3'), label: 'Napoléon Bonaparte', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('3'),
            type: 'text-hole',
            text: 'La révolution française a eu lieu en @@. Elle a entraîné la fin de la @@ en France.',
            answers: ['1789', 'monarchie'],
            points: 2,
          },
        ],
      }),
      QuizFactory.create({
        name: 'Quiz Géographie',
        subjectId: subjects[3].id, // Géographie
        questions: [
          {
            id: new Id('4'),
            type: 'qcm',
            text: 'Quel est le plus long fleuve de France ?',
            choices: [
              { id: new Id('1'), label: 'La Seine', isCorrect: false },
              { id: new Id('2'), label: 'La Loire', isCorrect: true },
              { id: new Id('3'), label: 'Le Rhône', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('5'),
            type: 'qcm',
            text: "Quelle est la capitale de l'Italie ?",
            choices: [
              { id: new Id('1'), label: 'Milan', isCorrect: false },
              { id: new Id('2'), label: 'Rome', isCorrect: true },
              { id: new Id('3'), label: 'Venise', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('6'),
            type: 'text-hole',
            text: 'Le désert du @@ est le plus grand désert chaud du monde, situé en Afrique.',
            answers: ['Sahara'],
            points: 2,
          },
        ],
      }),
      QuizFactory.create({
        name: 'Quiz Science',
        subjectId: subjects[1].id, // Science
        questions: [
          {
            id: new Id('7'),
            type: 'qcm',
            text: 'Quel est l\'élément chimique représenté par le symbole "O" ?',
            choices: [
              { id: new Id('1'), label: 'Or', isCorrect: false },
              { id: new Id('2'), label: 'Oxygène', isCorrect: true },
              { id: new Id('3'), label: 'Osmium', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('8'),
            type: 'qcm',
            text: 'Quelle est la planète la plus proche du Soleil ?',
            choices: [
              { id: new Id('1'), label: 'Vénus', isCorrect: false },
              { id: new Id('2'), label: 'Mercure', isCorrect: true },
              { id: new Id('3'), label: 'Mars', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('9'),
            type: 'text-hole',
            text: "L'eau est composée de deux atomes d'@@ et d'un atome d'@@.",
            answers: ['hydrogène', 'oxygène'],
            points: 2,
          },
        ],
      }),
      QuizFactory.create({
        name: 'Quiz Mathématiques',
        subjectId: subjects[0].id, // Maths
        questions: [
          {
            id: new Id('10'),
            type: 'qcm',
            text: 'Combien font 7 + 5 ?',
            choices: [
              { id: new Id('1'), label: '10', isCorrect: false },
              { id: new Id('2'), label: '12', isCorrect: true },
              { id: new Id('3'), label: '14', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('11'),
            type: 'qcm',
            text: "Quelle est la formule de l'aire d'un cercle ?",
            choices: [
              { id: new Id('1'), label: 'πr²', isCorrect: true },
              { id: new Id('2'), label: '2πr', isCorrect: false },
              { id: new Id('3'), label: 'r²', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('12'),
            type: 'text-hole',
            text: 'Un triangle avec deux côtés de même longueur est appelé triangle @@.',
            answers: ['isocèle'],
            points: 2,
          },
        ],
      }),
      QuizFactory.create({
        name: 'Quiz Anglais',
        subjectId: subjects[4].id, // Anglais
        questions: [
          {
            id: new Id('13'),
            type: 'qcm',
            text: 'What is the past tense of the verb "go"?',
            choices: [
              { id: new Id('1'), label: 'Go', isCorrect: false },
              { id: new Id('2'), label: 'Went', isCorrect: true },
              { id: new Id('3'), label: 'Gone', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('14'),
            type: 'qcm',
            text: 'How do you say "chat" in English?',
            choices: [
              { id: new Id('1'), label: 'Dog', isCorrect: false },
              { id: new Id('2'), label: 'Cat', isCorrect: true },
              { id: new Id('3'), label: 'Bird', isCorrect: false },
            ],
            points: 1,
          },
          {
            id: new Id('15'),
            type: 'text-hole',
            text: 'The @@ is shining today, it is a perfect day to go to the beach.',
            answers: ['sun'],
            points: 2,
          },
        ],
      }),
    ]

    await Promise.all(quizzes.map((quiz) => repo.save(quiz)))
  }
}
