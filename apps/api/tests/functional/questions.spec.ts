import { questionType } from '#domainModels/question'
import { test } from '@japa/runner'
import { QuestionFactory } from '../../app/domain/factories/question_factory.js'
import { UserAnswerFactory } from '../../app/domain/factories/user_answer_factory.js'

test.group('QCM Question', () => {
  const questionQCM = QuestionFactory.create({
    id: '1',
    type: questionType.QCM,
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
    const userAnswer = UserAnswerFactory.create({
      type: questionType.QCM,
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
    const userAnswer = UserAnswerFactory.create({
      type: questionType.QCM,
      id: '1',
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[1].id,
      userId: '1',
    })

    assert.equal(questionQCM.getUserAnswerPoints(userAnswer), 0)
  })
})

test.group('Text Hole Question', () => {
  const questionTextHole = QuestionFactory.create({
    id: '1',
    type: questionType.TEXT_HOLE,
    text: 'Question 1',
    points: 2,
    answers: ['hello', 'world'],
  })

  test('It should return the good amount of point if the user answer is 100% correct', async ({
    assert,
  }) => {
    const userAnswer = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
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
    const userAnswer = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
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
    const userAnswer = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
      id: '1',
      questionId: questionTextHole.id,
      values: ['aaa'],
      userId: '1',
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), 0)
  })
})
