import { QuizFactory } from '#quiz/domain/factories/quiz.factory'
import { CreateQuestionDto } from '#quiz/domain/models/quiz/question'
import { Quiz, QuizType } from '#quiz/domain/models/quiz/quiz'
import { Subject } from '#school/domain/models/subject'
import { Id } from '#shared/id/domain/models/id'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export class QuizBuilderTest {
  private _name = 'Quiz 1'
  private _type: QuizType = QuizType.PRACTICE
  private _questions: CreateQuestionDto[] = [
    {
      type: QuestionType.QCM,
      points: 1,
      text: 'What is the capital of France?',
      choices: [
        { label: 'Paris', isCorrect: true },
        { label: 'London', isCorrect: false },
      ],
    },
    {
      type: QuestionType.QCM,
      points: 1,
      text: 'What is the capital of UK?',
      choices: [
        { label: 'Paris', isCorrect: false },
        { label: 'London', isCorrect: true },
      ],
    },
    {
      type: QuestionType.TEXT_HOLE,
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
      type: this._type,
      startAt: new Date(),
      endAt: new Date(),
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

  withType(type: QuizType): this {
    this._type = type
    return this
  }
}
