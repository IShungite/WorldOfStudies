import { ChoiceNotFoundException } from '#quiz/domain/models/quiz/exceptions/choice_not_found.exception'
import {
  UserAnswer,
  UserAnswerQcm,
  UserAnswerTextHole,
} from '#quiz/domain/models/user_answer/user_answer'
import { Id } from '#shared/id/domain/models/id'

export enum QuestionType {
  QCM = 'qcm',
  TEXT_HOLE = 'text-hole',
}

type CreateQuestionDtoBase = {
  id?: Id
  type: QuestionType
  points: number
  text: string
}

export type CreateQuestionDtoChoice = {
  id?: Id
  label: string
  isCorrect: boolean
}

export type CreateQuestionDtoQcm = CreateQuestionDtoBase & {
  type: QuestionType.QCM
  choices: CreateQuestionDtoChoice[]
}

export type CreateQuestionDtoTextHole = CreateQuestionDtoBase & {
  type: QuestionType.TEXT_HOLE
  answers: string[]
}

export type CreateQuestionDto = CreateQuestionDtoQcm | CreateQuestionDtoTextHole

type QuestionProps = { id?: Id; type: QuestionType; points: number; text: string }

export abstract class Question {
  readonly id: Id
  readonly type: QuestionType
  readonly points: number
  readonly text: string

  protected constructor({ id, type, points, text }: QuestionProps) {
    this.id = id ?? Id.factory()
    this.type = type
    this.points = points
    this.text = text
  }

  abstract getUserAnswerPoints(userAnswer: UserAnswer): number
}

export class QCMChoice {
  readonly id: Id
  readonly label: string
  readonly isCorrect: boolean

  constructor({ id, label, isCorrect }: { id?: Id; label: string; isCorrect: boolean }) {
    this.id = id ?? Id.factory()
    this.label = label
    this.isCorrect = isCorrect
  }
}

export class QuestionQcm extends Question {
  readonly choices: QCMChoice[]

  constructor({
    id,
    points,
    choices,
    text,
  }: Omit<QuestionProps, 'type'> & {
    choices: QCMChoice[]
  }) {
    super({ id, points, type: QuestionType.QCM, text })
    this.choices = choices
  }

  private isCorrectChoice(choiceId: Id): boolean {
    const choice = this.choices.find((c) => c.id.equals(choiceId))

    if (!choice) {
      throw new ChoiceNotFoundException()
    }

    return choice.isCorrect
  }

  private isCorrectUserAnswer(userAnswer: UserAnswerQcm): boolean {
    return this.isCorrectChoice(userAnswer.choiceId)
  }

  getUserAnswerPoints(userAnswer: UserAnswerQcm): number {
    if (this.isCorrectUserAnswer(userAnswer)) {
      return this.points
    }
    return 0
  }
}

export class QuestionTextHole extends Question {
  readonly answers: string[]

  constructor({ id, points, text, answers }: Omit<QuestionProps, 'type'> & { answers: string[] }) {
    super({ id, points, type: QuestionType.TEXT_HOLE, text })
    this.answers = answers
  }

  private getCorrectAnswers(answers: string[]): string[] {
    const correctAnswers: string[] = []

    this.answers.forEach((answer, index) => {
      if (answer?.toLowerCase() === answers[index]?.toLowerCase()) {
        correctAnswers.push(answer)
      }
    })

    return correctAnswers
  }

  getUserAnswerPoints(userAnswer: UserAnswerTextHole): number {
    const correctAnswers = this.getCorrectAnswers(userAnswer.values)

    return (correctAnswers.length * this.points) / this.answers.length
  }
}
