import { QuestionQcm, QuestionTextHole } from '#domainModels/question'
import { UserAnswerQcm, UserAnswerTextHole } from '#domainModels/user_answer'
import { test } from '@japa/runner'

test.group('QCM Question', () => {
  const questionQCM = new QuestionQcm({
    id: '1',
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

  test('It should return true if the user answer is correct', async ({ assert }) => {
    const userAnswer = new UserAnswerQcm({
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: '1',
    })

    assert.isTrue(questionQCM.isCorrectUserAnswer(userAnswer))
  })
  test('It should return false if the user answer is not correct', async ({ assert }) => {
    const userAnswer = new UserAnswerQcm({
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[1].id,
      userId: '1',
    })

    assert.isFalse(questionQCM.isCorrectUserAnswer(userAnswer))
  })
})

test.group('Text Hole Question', () => {
  const questionTextHole = new QuestionTextHole({
    id: '1',
    text: 'Question 1',
    answers: ['hello', 'world'],
  })

  test('It should return true if the user answer is correct', async ({ assert }) => {
    const userAnswer = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: [...questionTextHole.answers],
      userId: '1',
    })

    assert.isTrue(questionTextHole.isCorrectUserAnswer(userAnswer))
  })

  test('It should return false if the user answer is not correct', async ({ assert }) => {
    const userAnswer = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: ['aaa'],
      userId: '1',
    })

    assert.isFalse(questionTextHole.isCorrectUserAnswer(userAnswer))
  })
})
