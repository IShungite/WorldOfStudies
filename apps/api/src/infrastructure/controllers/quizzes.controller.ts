import { CreateQuizService } from '#domain/services/quiz/create_quiz.service'
import { DeleteQuizService } from '#domain/services/quiz/delete_quiz.service'
import { GetQuizService } from '#domain/services/quiz/get_quiz.service'
import { GetQuizzesService } from '#domain/services/quiz/get_quizzes.service'
import { UpdateQuizService } from '#domain/services/quiz/update_quiz.service'
import { QuizMapper } from '#infrastructure/mappers/quiz.mapper'
import { createQuizValidator } from '#infrastructure/validators/create_quiz.validator'
import { domainIdValidator } from '#infrastructure/validators/domain_id.validator'
import { updateQuizValidator } from '#infrastructure/validators/update_quiz.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { paginationValidator } from '#infrastructure/validators/pagination.validator'
import { PaginationRequest } from '#domain/models/pagination/pagination_request'

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
  async index({ params, response }: HttpContext) {
    const pagination = await vine.validate({ schema: paginationValidator, data: params })
    const data = await this.getQuizzesService.execute(new PaginationRequest(pagination))

    return response.ok(QuizMapper.toResponseList(data.results))
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

    return response.ok(QuizMapper.toResponse(quiz))
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
