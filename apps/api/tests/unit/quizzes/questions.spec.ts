import { questionType } from '#domainModels/quiz/question'
import { test } from '@japa/runner'
import { Id } from '#domainModels/id/id'
import { UserAnswerFactory } from '#factories/user_answer.factory'
import { QuestionFactory } from '#factories/question.factory'

test.group('QCM Question', () => {
  const questionQCM = QuestionFactory.create({
    id: new Id('1'),
    type: questionType.QCM,
    points: 2,
    choices: [
      {
        id: new Id('1'),
        label: 'Choice 1',
        isCorrect: true,
      },
      {
        id: new Id('2'),
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
      id: new Id('1'),
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: new Id('1'),
    })

    assert.equal(questionQCM.getUserAnswerPoints(userAnswer), questionQCM.points)
  })
  test('It should return the good amount of point if the user answer is not correct', async ({
    assert,
  }) => {
    const userAnswer = UserAnswerFactory.create({
      type: questionType.QCM,
      id: new Id('1'),
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[1].id,
      userId: new Id('1'),
    })

    assert.equal(questionQCM.getUserAnswerPoints(userAnswer), 0)
  })
})

test.group('Text Hole Question', () => {
  const questionTextHole = QuestionFactory.create({
    id: new Id('1'),
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
      id: new Id('1'),
      questionId: questionTextHole.id,
      values: [...questionTextHole.answers],
      userId: new Id('1'),
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), questionTextHole.points)
  })

  test('It should return the good amount of point if the user answer is 50% correct', async ({
    assert,
  }) => {
    const userAnswer = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
      id: new Id('1'),
      questionId: questionTextHole.id,
      values: ['hello'],
      userId: new Id('1'),
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), questionTextHole.points / 2)
  })

  test('It should return the good amount of point if the user answer is 0% correct', async ({
    assert,
  }) => {
    const userAnswer = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
      id: new Id('1'),
      questionId: questionTextHole.id,
      values: ['aaa'],
      userId: new Id('1'),
    })

    assert.equal(questionTextHole.getUserAnswerPoints(userAnswer), 0)
  })
})
