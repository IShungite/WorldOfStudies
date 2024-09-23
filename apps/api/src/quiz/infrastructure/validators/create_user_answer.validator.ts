import vine from '@vinejs/vine'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { QuestionType } from '#quiz/domain/models/quiz/question'

const differentTypeOfUserAnswer = vine.group([
  vine.group.if((value) => value.type === QuestionType.QCM, {
    type: vine.literal(QuestionType.QCM),
    choiceId: domainIdValidator,
  }),
  vine.group.if((value) => value.type === QuestionType.TEXT_HOLE, {
    type: vine.literal(QuestionType.TEXT_HOLE),
    values: vine.array(vine.string().trim()),
  }),
])

export const createUserAnswerValidator = vine
  .object({
    characterId: domainIdValidator,
    type: vine.enum(QuestionType),
  })
  .merge(differentTypeOfUserAnswer)
