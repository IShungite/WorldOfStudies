import { test } from '@japa/runner'

import { QuestionQcm } from '#domain/question'
import { UserAnswer } from '#domain/user_answer'

test.group('QCM questions', () => {
  const questionQCM = new QuestionQcm(1, new Date(), new Date(), {
    type: 'qcm',
    choices: [
      { id: 1, label: 'test', isCorrect: true },
      { id: 2, label: 'test2', isCorrect: false },
    ],
  })

  test('It should return true if the user answer is correct', async ({ assert }) => {
    const userAnswer = new UserAnswer(1, 1, questionQCM.id, new Date(), new Date(), {
      type: 'qcm',
      selectedId: 1,
    })
    const wrongUserAnswer = new UserAnswer(1, 1, questionQCM.id, new Date(), new Date(), {
      type: 'qcm',
      selectedId: 2,
    })

    assert.isTrue(questionQCM.isUserAnswerValid(userAnswer))
    assert.isFalse(questionQCM.isUserAnswerValid(wrongUserAnswer))
  })
  test('It should return false if the user answer is not correct', async ({ assert }) => {
    const userAnswer = new UserAnswer(1, 1, questionQCM.id, new Date(), new Date(), {
      type: 'qcm',
      selectedId: 2,
    })

    assert.isFalse(questionQCM.isUserAnswerValid(userAnswer))
  })
})
