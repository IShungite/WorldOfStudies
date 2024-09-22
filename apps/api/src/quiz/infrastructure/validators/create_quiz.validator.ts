import vine from '@vinejs/vine'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { QuizType } from '#quiz/domain/models/quiz/quiz'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  subjectId: domainIdValidator,
  questions: vine.array(createQuestionValidator),
  type: vine.enum(Object.values(QuizType)).transform((value) => value ?? QuizType.PRACTICE),
  startAt: vine
    .date({ formats: { utc: true } })
    .optional()
    .requiredWhen('type', '=', QuizType.EXAM),
  endAt: vine
    .date({ formats: { utc: true } })
    .optional()
    .requiredWhen('type', '=', QuizType.EXAM),
})
