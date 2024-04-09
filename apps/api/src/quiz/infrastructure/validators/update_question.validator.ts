import { questionType } from '../../domain/models/quiz/question.js'
import {
  createQuestionValidator,
  createQcmContentValidator,
  createQcmChoiceValidator,
  createTextHoleContentValidator,
} from './create_question.validator.js'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
import vine from '@vinejs/vine'

const updateQcmContentValidator = vine.object({
  ...createQcmContentValidator.getProperties(),
  choices: vine.array(
    vine.object({
      ...createQcmChoiceValidator.getProperties(),
      id: domainIdValidator,
    })
  ),
})

const updateTextHoleContentValidator = vine.object({
  ...createTextHoleContentValidator.getProperties(),
})

const updateQuestionTypeUnionValidator = vine.group([
  vine.group.if(
    (value) => questionType.QCM === value.type,
    updateQcmContentValidator.getProperties()
  ),
  vine.group.if(
    (value) => questionType.TEXT_HOLE === value.type,
    updateTextHoleContentValidator.getProperties()
  ),
])

export const updateQuestionValidator = vine
  .object({
    ...createQuestionValidator.getProperties(),
    id: domainIdValidator,
  })
  .merge(updateQuestionTypeUnionValidator)
