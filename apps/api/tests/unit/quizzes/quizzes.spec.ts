import { test } from '@japa/runner'
import { QuestionFactory } from '#quiz/domain/factories/question.factory'
import { Id } from '#shared/id/domain/models/id'
import { QuestionType } from '#quiz/domain/models/quiz/question'
import { UserAnswerFactory } from '#quiz/domain/factories/user_answer.factory'
import { Quiz } from '#quiz/domain/models/quiz/quiz'

test.group('Quizzes', () => {
  const questionQCM = QuestionFactory.create({
    id: new Id('1'),
    type: QuestionType.QCM,
    text: 'Question 1',
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
    type: QuestionType.TEXT_HOLE,
    text: 'Question 1',
    points: 2,
    answers: ['hello', 'world'],
  })

  const quiz = new Quiz({
    id: new Id('1'),
    name: 'My Exo',
    questions: [questionQCM, questionTextHole],
    subjectId: new Id('1'),
  })

  test('It should return the good total amount of points', async ({ assert }) => {
    const userAnswer1 = UserAnswerFactory.create({
      type: QuestionType.QCM,
      id: new Id('1'),
      questionId: questionQCM.id,
      choiceId: questionQCM.choices[0].id,
      characterId: new Id('1'),
      quizInstanceId: quiz.id,
    })

    const userAnswers2 = UserAnswerFactory.create({
      type: QuestionType.TEXT_HOLE,
      id: new Id('1'),
      questionId: questionTextHole.id,
      values: ['hello'],
      characterId: new Id('1'),
      quizInstanceId: quiz.id,
    })

    assert.equal(quiz.getTotalUserPoints([userAnswer1, userAnswers2]), 3)
  })
})
