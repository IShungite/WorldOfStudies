import { questionType } from '../../domain/models/quiz/question.js'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
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
    characterId: domainIdValidator,
    type: vine.enum(questionType),
  })
  .merge(differentTypeOfUserAnswer)
