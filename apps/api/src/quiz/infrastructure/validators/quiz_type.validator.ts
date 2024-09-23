import { QuizType } from '#quiz/domain/models/quiz/quiz'
import vine from '@vinejs/vine'

export const quizTypeValidator = vine.enum(QuizType).parse((value) => value ?? QuizType.PRACTICE)
