import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { GetQuizzesService } from '#quiz/domain/services/quiz/get_quizzes.service'
import { GetQuizService } from '#quiz/domain/services/quiz/get_quiz.service'
import { CreateQuizService } from '#quiz/domain/services/quiz/create_quiz.service'
import { UpdateQuizService } from '#quiz/domain/services/quiz/update_quiz.service'
import { DeleteQuizService } from '#quiz/domain/services/quiz/delete_quiz.service'
import { paginationValidator } from '#shared/pagination/infrastructure/validators/pagination.validator'
import { PaginationRequest } from '#shared/pagination/domain/models/pagination_request'
import { QuizApiMapper } from '#quiz/infrastructure/mappers/quiz_api.mapper'
import { createQuizValidator } from '#quiz/infrastructure/validators/create_quiz.validator'
import { domainIdValidator } from '#shared/id/infrastructure/validators/domain_id.validator'
import { updateQuizValidator } from '#quiz/infrastructure/validators/update_quiz.validator'
import { PaginationApiMapper } from '#shared/pagination/infrastructure/mappers/pagination_api.mapper'
import getPaginationLinks from '#shared/pagination/infrastructure/utils/get_pagination_links'

@inject()
export default class QuizzesController {
  constructor(
    private readonly getQuizzesService: GetQuizzesService,
    private readonly getQuizService: GetQuizService,
    private readonly createQuizService: CreateQuizService,
    private readonly updateQuizService: UpdateQuizService,
    private readonly deleteQuizService: DeleteQuizService
  ) {}

  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const pagination = await vine.validate({ schema: paginationValidator, data: request.qs() })
    const data = await this.getQuizzesService.execute(new PaginationRequest(pagination))

    return response.ok({
      ...PaginationApiMapper.toResponse(data, QuizApiMapper.toResponse),
      _links: getPaginationLinks(request.url(), data),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createQuizValidator, data: request.all() })

    const quiz = await this.createQuizService.execute(payload)

    return response.created(quiz)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    return this.getQuizService.execute(id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const payload = await vine.validate({ schema: updateQuizValidator, data: request.all() })

    const quiz = await this.updateQuizService.execute(id, payload)

    return response.ok(QuizApiMapper.toResponse(quiz))
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteQuizService.execute(id)

    return response.noContent()
  }
}
