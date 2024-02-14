import { questionType } from '#domainModels/question'
import vine from '@vinejs/vine'

const data = vine.group([
  vine.group.if((value) => questionType.QCM === value.type, {
    type: vine.literal('qcm'),
    choices: vine.array(
      vine.object({
        label: vine.string(),
        isCorrect: vine.boolean(),
      })
    ),
  }),
  vine.group.if((value) => questionType.TEXT_HOLE === value.type, {
    type: vine.literal('text-hole'),
    text: vine.string(),
    answers: vine.array(vine.string()),
  }),
])

export const createQuestionValidator = vine.object({ points: vine.number() }).merge(data)
