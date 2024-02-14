import { QuestionQcm, QuestionTextHole } from '#domainModels/question'
import { Exercice } from '#domainModels/exercice'
import { UserAnswerQcm, UserAnswerTextHole } from '#domainModels/user_answer'
import { test } from '@japa/runner'

test.group('Exercices', () => {
  const questionQCM = new QuestionQcm({
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

  const questionTextHole = new QuestionTextHole({
    id: '2',
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
    const userAnswer1 = new UserAnswerQcm({
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: '1',
    })

    const userAnswers2 = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: ['hello'],
      userId: '1',
    })

    assert.equal(exercice.getTotalUserPoints([userAnswer1, userAnswers2]), 3)
  })
})
