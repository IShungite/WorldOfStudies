import { EmptyIdException } from '#domain/models/id/empty_id.exception'
import { ChoiceNotFoundException } from '#domain/models/quiz/choice_not_found.exception'
import { InvalidQuestionTypeException } from '#domain/models/quiz/invalid_question_type.exception'
import { QuizNotFoundException } from '#domain/models/quiz/quiz_not_found.exception'
import { PromotionNotFoundException } from '#domain/models/school/promotion_not_found.exception'
import { SchoolNotFoundException } from '#domain/models/school/school_not_found.exception'
import { SubjectNotFoundException } from '#domain/models/school/subject_not_found.exception'
import { InvalidCredentialsException } from '#domain/models/user/invalid_credentials.exception'
import { UserAlreadyExistsException } from '#domain/models/user/user_already_exists.exception'
import { UserNotFoundException } from '#domain/models/user/user_not_found.exception'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
import { CharacterNotFoundException } from '#domain/models/character/character_not_found.exception'
import { InvalidPriceException } from '#domain/models/shop/invalid_price.exception'
import { ShopNotFoundException } from '#domain/models/shop/shop_not_found_exception'
import { UnauthorizedException } from '#domain/models/exceptions/unauthorized.exception'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  private formatError(error: string | string[]) {
    return { errors: Array.isArray(error) ? error : [error] }
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      ctx.response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send(this.formatError(error.messages.map((e: { message: string }) => e.message)))
      return
    }

    if (error instanceof UserAlreadyExistsException) {
      ctx.response.status(StatusCodes.CONFLICT).send(this.formatError(error.message))
      return
    }

    if (error instanceof UserNotFoundException) {
      ctx.response.status(StatusCodes.NOT_FOUND).send(this.formatError(error.message))
      return
    }

    if (error instanceof InvalidCredentialsException) {
      ctx.response.status(StatusCodes.UNAUTHORIZED).send(this.formatError(error.message))
      return
    }

    if (error instanceof UnauthorizedException) {
      ctx.response.status(StatusCodes.UNAUTHORIZED).send(this.formatError(error.message))
      return
    }

    if (
      error instanceof InvalidQuestionTypeException ||
      error instanceof EmptyIdException ||
      error instanceof ChoiceNotFoundException ||
      error instanceof SchoolNotFoundException ||
      error instanceof PromotionNotFoundException ||
      error instanceof QuizNotFoundException ||
      error instanceof SubjectNotFoundException ||
      error instanceof QuizNotFoundException ||
      error instanceof CharacterNotFoundException ||
      error instanceof InvalidPriceException ||
      error instanceof ShopNotFoundException
    ) {
      ctx.response.status(StatusCodes.BAD_REQUEST).send(this.formatError(error.message))
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
