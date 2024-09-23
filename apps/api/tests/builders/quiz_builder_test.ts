import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { CreateQuestionDto, QCMChoice } from '#quiz/domain/models/quiz/question'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { Subject } from '#school/domain/models/subject'
import { Id } from '#shared/id/domain/models/id'

export class QuizBuilderTest {
  private _name = 'Quiz 1'
  private _questions: CreateQuestionDto[] = [
    {
      type: 'qcm',
      points: 1,
      text: 'What is the capital of France?',
      choices: [
        { label: 'Paris', isCorrect: true },
        { label: 'London', isCorrect: false },
      ],
    },
    {
      type: 'qcm',
      points: 1,
      text: 'What is the capital of UK?',
      choices: [
        { label: 'Paris', isCorrect: false },
        { label: 'London', isCorrect: true },
      ],
    },
    {
      type: 'text-hole',
      points: 1,
      text: 'The capital of France is @@',
      answers: ['Paris'],
    },
  ]
  private _subjectId = Id.factory()

  build(): Quiz {
    return QuizFactory.create({
      name: this._name,
      questions: this._questions,
      subjectId: this._subjectId,
      type: QuizType.PRACTICE,
    })
  }

  withName(name: string): this {
    this._name = name
    return this
  }

  withQuestions(questions: CreateQuestionDto[]): this {
    this._questions = questions
    return this
  }

  withSubject(subject: Subject): this {
    this._subjectId = subject.id
    return this
  }
}
