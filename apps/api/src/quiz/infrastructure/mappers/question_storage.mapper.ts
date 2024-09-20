import { QuestionFactory } from '#quiz/domain/factories/question.factory'
import { CreateQuestionDtoChoice, Question, questionType } from '#quiz/domain/models/quiz/question'
import QuestionEntity from '#quiz/infrastructure/entities/question'
import { Id } from '#shared/id/domain/models/id'

export class QuestionStorageMapper {
  static fromLucid(question: QuestionEntity): Question {
    const extra = JSON.parse(question.extra)
    const id = new Id(question.id.toString())

    if (question.type === questionType.QCM) {
      return QuestionFactory.create({
        id: id,
        type: question.type,
        points: question.points,
        choices: extra.choices.map((choice: CreateQuestionDtoChoice & { id: string }) => ({
          id: new Id(choice.id.toString()),
          label: choice.label,
          isCorrect: choice.isCorrect,
        })),
        text: extra.text,
      })
    }

    if (question.type === questionType.TEXT_HOLE) {
      return QuestionFactory.create({
        id: id,
        type: question.type,
        points: question.points,
        text: extra.text,
        answers: extra.answers,
      })
    }

    throw new Error('Invalid question type')
  }
}
