import vine from '@vinejs/vine'
import { createQuestionValidator } from '#quiz/infrastructure/validators/create_question.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { QuizType } from '#quiz/domain/models/quiz/quiz'
import { quizTypeValidator } from '#quiz/infrastructure/validators/quiz_type.validator'

export const createQuizValidator = vine.object({
  name: vine.string().trim(),
  subjectId: domainIdValidator,
  questions: vine.array(createQuestionValidator),
  type: quizTypeValidator,
  startAt: vine
    .date({ formats: { utc: true } })
    .optional()
    .requiredWhen('type', '=', QuizType.EXAM),
  endAt: vine
    .date({ formats: { utc: true } })
    .optional()
    .requiredWhen('type', '=', QuizType.EXAM),
})
