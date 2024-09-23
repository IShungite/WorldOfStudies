import vine from '@vinejs/vine'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { QuizType } from '#quiz/domain/models/quiz/quiz'
import { quizTypeValidator } from '#quiz/infrastructure/validators/quiz_type.validator'

const createPracticeQuizValidator = vine.object({
  type: vine.literal(QuizType.PRACTICE),
})

const createExamQuizValidator = vine.object({
  type: vine.literal(QuizType.EXAM),
  startAt: vine.date({ formats: { utc: true } }),
  endAt: vine.date({ formats: { utc: true } }),
})

const createQuizTypeUnionValidator = vine.group([
  vine.group.if(
    (value) => QuizType.PRACTICE === value.type,
    createPracticeQuizValidator.getProperties()
  ),
  vine.group.if((value) => QuizType.EXAM === value.type, createExamQuizValidator.getProperties()),
])

export const createQuizValidator = vine
  .object({
    name: vine.string().trim(),
    subjectId: domainIdValidator,
    questions: vine.array(createQuestionValidator),
    type: quizTypeValidator,
  })
  .merge(createQuizTypeUnionValidator)
