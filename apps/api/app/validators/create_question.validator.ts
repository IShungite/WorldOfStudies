import { questionType } from '#domainModels/quiz/question'
import vine from '@vinejs/vine'

const differentTypeOfQuestion = vine.group([
  vine.group.if((value) => questionType.QCM === value.type, {
    type: vine.literal(questionType.QCM),
    choices: vine.array(
      vine.object({
        label: vine.string(),
        isCorrect: vine.boolean(),
      })
    ),
  }),
  vine.group.if((value) => questionType.TEXT_HOLE === value.type, {
    type: vine.literal(questionType.TEXT_HOLE),
    text: vine.string(),
    answers: vine.array(vine.string()),
  }),
])

export const createQuestionValidator = vine
  .object({ points: vine.number(), type: vine.enum(questionType) })
  .merge(differentTypeOfQuestion)
