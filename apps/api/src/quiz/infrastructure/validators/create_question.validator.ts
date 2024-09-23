import vine from '@vinejs/vine'
import { QuestionType } from '#quiz/domain/models/quiz/question'

export const createQcmChoiceValidator = vine.object({
  label: vine.string(),
  isCorrect: vine.boolean(),
})

export const createQcmContentValidator = vine.object({
  type: vine.literal(QuestionType.QCM),
  choices: vine.array(createQcmChoiceValidator),
})

export const createTextHoleContentValidator = vine.object({
  type: vine.literal(QuestionType.TEXT_HOLE),
  answers: vine.array(vine.string()),
})

export const createQuestionTypeUnionValidator = vine.group([
  vine.group.if(
    (value) => QuestionType.QCM === value.type,
    createQcmContentValidator.getProperties()
  ),
  vine.group.if(
    (value) => QuestionType.TEXT_HOLE === value.type,
    createTextHoleContentValidator.getProperties()
  ),
])

export const createQuestionValidator = vine
  .object({ points: vine.number(), type: vine.enum(QuestionType), text: vine.string() })
  .merge(createQuestionTypeUnionValidator)
