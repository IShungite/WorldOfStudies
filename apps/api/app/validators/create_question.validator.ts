import { questionType } from '#domainModels/quiz/question'
import vine from '@vinejs/vine'

export const createQcmChoiceValidator = vine.object({
  label: vine.string(),
  isCorrect: vine.boolean(),
})

export const createQcmContentValidator = vine.object({
  type: vine.literal(questionType.QCM),
  choices: vine.array(createQcmChoiceValidator),
})

export const createTextHoleContentValidator = vine.object({
  type: vine.literal(questionType.TEXT_HOLE),
  text: vine.string(),
  answers: vine.array(vine.string()),
})

export const createQuestionTypeUnionValidator = vine.group([
  vine.group.if(
    (value) => questionType.QCM === value.type,
    createQcmContentValidator.getProperties()
  ),
  vine.group.if(
    (value) => questionType.TEXT_HOLE === value.type,
    createTextHoleContentValidator.getProperties()
  ),
])

export const createQuestionValidator = vine
  .object({ points: vine.number(), type: vine.enum(questionType) })
  .merge(createQuestionTypeUnionValidator)
