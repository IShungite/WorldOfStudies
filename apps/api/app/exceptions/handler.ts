import { EmptyIdException } from '#domainModels/id/empty_id.exception'
import { ChoiceNotFoundException } from '#domainModels/quiz/choice_not_found.exception'
import { InvalidQuestionTypeException } from '#domainModels/quiz/invalid_question_type.exception'
import { PromotionNotFoundException } from '#domainModels/school/promotion_not_found.exception'
import { SchoolNotFoundException } from '#domainModels/school/school_not_found.exception'
import { InvalidCredentialsException } from '#domainModels/user/invalid_credentials.exception'
import { UserAlreadyExistsException } from '#domainModels/user/user_already_exists.exception'
import { UserNotFoundException } from '#domainModels/user/user_not_found.exception'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      ctx.response.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error.messages)
      return
    }

    if (error instanceof UserAlreadyExistsException) {
      ctx.response.status(StatusCodes.CONFLICT).send(error.message)
      return
    }

    if (error instanceof UserNotFoundException) {
      ctx.response.status(StatusCodes.NOT_FOUND).send(error.message)
      return
    }

    if (error instanceof InvalidCredentialsException) {
      ctx.response.status(StatusCodes.UNAUTHORIZED).send(error.message)
      return
    }

    if (
      error instanceof InvalidQuestionTypeException ||
      error instanceof EmptyIdException ||
      error instanceof ChoiceNotFoundException ||
      error instanceof SchoolNotFoundException ||
      error instanceof PromotionNotFoundException
    ) {
      ctx.response.status(StatusCodes.BAD_REQUEST).send(error.message)
      return
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
