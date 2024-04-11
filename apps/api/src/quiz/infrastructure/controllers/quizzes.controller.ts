import { CreateQuizService } from '../../domain/services/quiz/create_quiz.service.js'
import { DeleteQuizService } from '../../domain/services/quiz/delete_quiz.service.js'
import { GetQuizService } from '../../domain/services/quiz/get_quiz.service.js'
import { GetQuizzesService } from '../../domain/services/quiz/get_quizzes.service.js'
import { UpdateQuizService } from '../../domain/services/quiz/update_quiz.service.js'
import { QuizApiMapper } from '../mappers/quiz_api.mapper.js'
import { createQuizValidator } from '../validators/create_quiz.validator.js'
import { domainIdValidator } from '../../../shared/id/infrastructure/validators/domain_id.validator.js'
import { updateQuizValidator } from '../validators/update_quiz.validator.js'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { paginationValidator } from '../../../shared/pagination/infrastructure/validators/pagination.validator.js'
import { PaginationRequest } from '../../../shared/pagination/domain/models/pagination_request.js'

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

    return response.ok(QuizApiMapper.toPaginatedResponse(data))
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
