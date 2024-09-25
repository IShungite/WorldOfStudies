import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { IQuizzesRepository } from '#quiz/domain/contracts/quizzes.repository'
import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { Id } from '#shared/id/domain/models/id'
import { subjects } from '#database/seeders/1_subject_seeder'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export const quizzes: Quiz[] = [
  QuizFactory.create({
    name: 'Quiz Histoire',
    subjectId: subjects[2].id, // Histoire
    type: QuizType.PRACTICE,
    questions: [
      {
        id: new Id('1'),
        type: QuestionType.QCM,
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
        type: QuestionType.QCM,
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
        type: QuestionType.TEXT_HOLE,
        text: 'La révolution française a eu lieu en @@. Elle a entraîné la fin de la @@ en France.',
        answers: ['1789', 'monarchie'],
        points: 2,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Quiz Géographie',
    subjectId: subjects[3].id, // Géographie
    type: QuizType.PRACTICE,
    questions: [
      {
        id: new Id('4'),
        type: QuestionType.QCM,
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
        type: QuestionType.QCM,
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
        type: QuestionType.TEXT_HOLE,
        text: 'Le désert du @@ est le plus grand désert chaud du monde, situé en Afrique.',
        answers: ['Sahara'],
        points: 2,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Quiz Science',
    subjectId: subjects[1].id, // Science
    type: QuizType.PRACTICE,
    questions: [
      {
        id: new Id('7'),
        type: QuestionType.QCM,
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
        type: QuestionType.QCM,
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
        type: QuestionType.TEXT_HOLE,
        text: "L'eau est composée de deux atomes d'@@ et d'un atome d'@@.",
        answers: ['hydrogène', 'oxygène'],
        points: 2,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Quiz Mathématiques',
    subjectId: subjects[0].id, // Maths
    type: QuizType.PRACTICE,
    questions: [
      {
        id: new Id('10'),
        type: QuestionType.QCM,
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
        type: QuestionType.QCM,
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
        type: QuestionType.TEXT_HOLE,
        text: 'Un triangle avec deux côtés de même longueur est appelé triangle @@.',
        answers: ['isocèle'],
        points: 2,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Quiz Anglais',
    subjectId: subjects[4].id, // Anglais
    type: QuizType.PRACTICE,
    questions: [
      {
        id: new Id('13'),
        type: QuestionType.QCM,
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
        type: QuestionType.QCM,
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
        type: QuestionType.TEXT_HOLE,
        text: 'The @@ is shining today, it is a perfect day to go to the beach.',
        answers: ['sun'],
        points: 2,
      },
    ],
  }),

  // EXAM
  QuizFactory.create({
    name: "Contrôle d'Histoire",
    subjectId: subjects[2].id, // Histoire
    type: QuizType.EXAM,
    startAt: new Date(),
    endAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    questions: [
      {
        type: QuestionType.QCM,
        text: 'Quel traité a mis fin à la Première Guerre mondiale ?',
        choices: [
          { id: new Id('1'), label: 'Traité de Versailles', isCorrect: true },
          { id: new Id('2'), label: 'Traité de Tordesillas', isCorrect: false },
          { id: new Id('3'), label: 'Traité de Rome', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: "L'empereur Napoléon Bonaparte a été battu à la bataille de @@ en 1815.",
        answers: ['Waterloo'],
        points: 2,
      },
      {
        type: QuestionType.QCM,
        text: 'Quel pays a déclenché la Première Guerre mondiale en envahissant la Serbie ?',
        choices: [
          { id: new Id('1'), label: 'Autriche-Hongrie', isCorrect: true },
          { id: new Id('2'), label: 'Allemagne', isCorrect: false },
          { id: new Id('3'), label: 'Russie', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: "La Seconde Guerre mondiale a débuté en @@ avec l'invasion de la Pologne.",
        answers: ['1939'],
        points: 2,
      },
      {
        type: QuestionType.QCM,
        text: 'Qui a été le premier président de la République française ?',
        choices: [
          { id: new Id('1'), label: 'Louis-Napoléon Bonaparte', isCorrect: true },
          { id: new Id('2'), label: 'Charles de Gaulle', isCorrect: false },
          { id: new Id('3'), label: 'François Mitterrand', isCorrect: false },
        ],
        points: 1,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Contrôle de Géographie',
    subjectId: subjects[3].id, // Géographie
    type: QuizType.EXAM,
    startAt: new Date(),
    endAt: new Date(new Date().setDate(new Date().getDate() + 2)),
    questions: [
      {
        type: QuestionType.QCM,
        text: 'Quelle est la plus grande mer intérieure du monde ?',
        choices: [
          { id: new Id('1'), label: 'La mer Caspienne', isCorrect: true },
          { id: new Id('2'), label: 'La mer Noire', isCorrect: false },
          { id: new Id('3'), label: 'La mer Méditerranée', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: "Le point le plus élevé sur Terre est le mont @@, situé dans la chaîne de l'Himalaya.",
        answers: ['Everest'],
        points: 2,
      },
      {
        type: QuestionType.QCM,
        text: "Quel continent est entièrement situé dans l'hémisphère Sud ?",
        choices: [
          { id: new Id('1'), label: "L'Australie", isCorrect: true },
          { id: new Id('2'), label: "L'Afrique", isCorrect: false },
          { id: new Id('3'), label: "L'Amérique du Sud", isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.QCM,
        text: "Quelle est la capitale de l'Australie ?",
        choices: [
          { id: new Id('1'), label: 'Sydney', isCorrect: false },
          { id: new Id('2'), label: 'Canberra', isCorrect: true },
          { id: new Id('3'), label: 'Melbourne', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: "Le fleuve qui traverse l'Égypte et qui est essentiel à sa civilisation est le @@.",
        answers: ['Nil'],
        points: 2,
      },
    ],
  }),
  QuizFactory.create({
    name: 'Contrôle de Science',
    subjectId: subjects[1].id, // Science
    type: QuizType.EXAM,
    startAt: new Date(),
    endAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    questions: [
      {
        type: QuestionType.QCM,
        text: "Quel est l'organe principal du système circulatoire humain ?",
        choices: [
          { id: new Id('1'), label: 'Le cœur', isCorrect: true },
          { id: new Id('2'), label: 'Les poumons', isCorrect: false },
          { id: new Id('3'), label: 'Le foie', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: 'La photosynthèse est un processus par lequel les plantes transforment la lumière solaire en @@.',
        answers: ['énergie'],
        points: 2,
      },
      {
        type: QuestionType.QCM,
        text: "Quel est l'élément chimique ayant pour symbole 'H' ?",
        choices: [
          { id: new Id('1'), label: 'Hydrogène', isCorrect: true },
          { id: new Id('2'), label: 'Hélium', isCorrect: false },
          { id: new Id('3'), label: 'Hafnium', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.QCM,
        text: 'Comment appelle-t-on un animal qui mange à la fois des plantes et de la viande ?',
        choices: [
          { id: new Id('1'), label: 'Omnivore', isCorrect: true },
          { id: new Id('2'), label: 'Carnivore', isCorrect: false },
          { id: new Id('3'), label: 'Herbivore', isCorrect: false },
        ],
        points: 1,
      },
      {
        type: QuestionType.TEXT_HOLE,
        text: 'Le liquide qui circule dans le système circulatoire humain est le @@.',
        answers: ['sang'],
        points: 2,
      },
    ],
  }),
]

export const quizHistoire = quizzes[0]
export const quizGeographie = quizzes[1]
export const quizScience = quizzes[2]
export const quizMaths = quizzes[3]
export const quizAnglais = quizzes[4]
export const controleHistoire = quizzes[5]
export const controleGeographie = quizzes[6]
export const controleScience = quizzes[7]

export default class extends BaseSeeder {
  async run() {
    const repo = await app.container.make(IQuizzesRepository)
    await Promise.all(quizzes.map((quiz) => repo.save(quiz)))
  }
}
