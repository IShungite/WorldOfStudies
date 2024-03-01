import { Quiz } from '#domainModels/quiz/quiz'
import { questionType } from '#domainModels/quiz/question'
import { test } from '@japa/runner'
import { Id } from '#domainModels/id'
import { QuestionFactory } from '#factories/question.factory'
import { UserAnswerFactory } from '#factories/user_answer.factory'

test.group('Quizzes', () => {
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

  const questionTextHole = QuestionFactory.create({
    id: new Id('2'),
    type: questionType.TEXT_HOLE,
    text: 'Question 1',
    points: 2,
    answers: ['hello', 'world'],
  })

  const quiz = new Quiz({
    id: new Id('1'),
    name: 'My Exo',
    questions: [questionQCM, questionTextHole],
  })

  test('It should return the good total amount of points', async ({ assert }) => {
    const userAnswer1 = UserAnswerFactory.create({
      type: questionType.QCM,
      id: new Id('1'),
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      userId: new Id('1'),
    })

    const userAnswers2 = UserAnswerFactory.create({
      type: questionType.TEXT_HOLE,
      id: new Id('1'),
      questionId: questionTextHole.id,
      values: ['hello'],
      userId: new Id('1'),
    })

    assert.equal(quiz.getTotalUserPoints([userAnswer1, userAnswers2]), 3)
  })
})