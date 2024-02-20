import { Exercice } from '#domainModels/exercice'
import { questionType } from '#domainModels/question'
import { test } from '@japa/runner'
import { QuestionFactory } from '../../app/domain/factories/question_factory.js'
import { UserAnswerFactory } from '../../app/domain/factories/user_answer_factory.js'

test.group('Exercices', () => {
  const questionQCM = QuestionFactory.create({
    type: questionType.QCM,
    id: '1',
    points: 2,
    choices: [
      {
        id: '1',
        label: 'Choice 1',
        isCorrect: true,
      },
      {
        id: '2',
        label: 'Choice 2',
        isCorrect: false,
      },
    ],
  })

  const questionTextHole = QuestionFactory.create({
    id: '2',
    type: questionType.TEXT_HOLE,
    text: 'Question 1',
    points: 2,
    answers: ['hello', 'world'],
  })

  const exercice = new Exercice({
    id: '1',
    name: 'My Exo',
    questions: [questionQCM, questionTextHole],
  })

  test('It should return the good total amount of points', async ({ assert }) => {
    const userAnswer1 = UserAnswerFactory.create({
      type: questionType.QCM,
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: '1',
    })

    const userAnswers2 = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
      id: '1',
      questionId: questionTextHole.id,
      values: ['hello'],
      userId: '1',
    })

    assert.equal(exercice.getTotalUserPoints([userAnswer1, userAnswers2]), 3)
  })
})
