import { QuestionQcm, QuestionTextHole } from '#domainModels/question'
import { UserAnswerQcm, UserAnswerTextHole } from '#domainModels/user_answer'
import { test } from '@japa/runner'

test.group('QCM Question', () => {
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

  test('It should return the good amount of point if the user answer is correct', async ({
    assert,
  }) => {
    const userAnswer = new UserAnswerQcm({
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: '1',
    })

    assert.equal(questionQCM.getUserAnswerPoints(userAnswer), questionQCM.points)
  })
  test('It should return the good amount of point if the user answer is not correct', async ({
    assert,
  }) => {
    const userAnswer = new UserAnswerQcm({
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[1].id,
      userId: '1',
    })

    assert.equal(questionQCM.getUserAnswerPoints(userAnswer), 0)
  })
})

test.group('Text Hole Question', () => {
  const questionTextHole = new QuestionTextHole({
    id: '1',
    text: 'Question 1',
    points: 2,
    answers: ['hello', 'world'],
  })

  test('It should return the good amount of point if the user answer is 100% correct', async ({
    assert,
  }) => {
    const userAnswer = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: [...questionTextHole.answers],
      userId: '1',
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), questionTextHole.points)
  })

  test('It should return the good amount of point if the user answer is 50% correct', async ({
    assert,
  }) => {
    const userAnswer = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: ['hello'],
      userId: '1',
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), questionTextHole.points / 2)
  })

  test('It should return the good amount of point if the user answer is 0% correct', async ({
    assert,
  }) => {
    const userAnswer = new UserAnswerTextHole({
      id: '1',
      questionId: questionTextHole.id,
      values: ['aaa'],
      userId: '1',
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), 0)
  })
})
