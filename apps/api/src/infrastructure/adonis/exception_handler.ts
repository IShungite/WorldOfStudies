import { EmptyIdException } from '../../shared/id/domain/models/empty_id.exception.js'
import { ChoiceNotFoundException } from '../../quiz/domain/models/quiz/choice_not_found.exception.js'
import { InvalidQuestionTypeException } from '../../quiz/domain/models/quiz/invalid_question_type.exception.js'
import { QuizNotFoundException } from '../../quiz/domain/models/quiz/quiz_not_found.exception.js'
import { PromotionNotFoundException } from '../../school/domain/models/promotion_not_found.exception.js'
import { SchoolNotFoundException } from '../../school/domain/models/school_not_found.exception.js'
import { SubjectNotFoundException } from '../../school/domain/models/subject_not_found.exception.js'
import { InvalidCredentialsException } from '../../user/domain/models/invalid_credentials.exception.js'
import { UserAlreadyExistsException } from '../../user/domain/models/user_already_exists.exception.js'
import { UserNotFoundException } from '../../user/domain/models/user_not_found.exception.js'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors } from '@vinejs/vine'
import { StatusCodes } from 'http-status-codes'
import { CharacterNotFoundException } from '../../character/domain/models/character_not_found.exception.js'
import { InvalidPriceException } from '../../shop/domain/models/invalid_price.exception.js'
import { ShopNotFoundException } from '../../shop/domain/models/shop_not_found_exception.js'
import { UnauthorizedException } from '../../shared/exceptions/unauthorized.exception'
import { ShopCategoryNotFoundException } from '../../shop/domain/models/shop_category_not_found_exception.js'
import { ShopProductNotFoundException } from '../../shop/domain/models/shop_product_not_found_exception.js'

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
      error instanceof ShopNotFoundException ||
      error instanceof ShopCategoryNotFoundException ||
      error instanceof ShopProductNotFoundException
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
