import { questionType } from '#domainModels/quiz/question'
import { domainIdValidator } from '#validators/domain_id.validator'
import vine from '@vinejs/vine'

const differentTypeOfUserAnswer = vine.group([
  vine.group.if((value) => value.type === questionType.QCM, {
    type: vine.literal(questionType.QCM),
    choiceId: domainIdValidator,
  }),
  vine.group.if((value) => value.type === questionType.TEXT_HOLE, {
    type: vine.literal(questionType.TEXT_HOLE),
    values: vine.array(vine.string().trim()),
  }),
])

export const createUserAnswerValidator = vine
  .object({
    questionId: domainIdValidator,
    userId: domainIdValidator,
    type: vine.enum(questionType),
  })
  .merge(differentTypeOfUserAnswer)
