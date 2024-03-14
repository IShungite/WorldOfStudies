import { CreateQuizService } from '#domainServices/quiz/create_quiz.service'
import { DeleteQuizService } from '#domainServices/quiz/delete_quiz.service'
import { GetQuizService } from '#domainServices/quiz/get_quiz.service'
import { GetQuizzesService } from '#domainServices/quiz/get_quizzes.service'
import { UpdateQuizService } from '#domainServices/quiz/update_quiz.service'
import { createQuizValidator } from '#validators/create_quiz.validator'
import { domainIdValidator } from '#validators/domain_id.validator'
import { updateQuestionValidator } from '#validators/update_question.validator'
import { updateQuizValidator } from '#validators/update_quiz.validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

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
  async index({}: HttpContext) {
    return this.getQuizzesService.getAll()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await vine.validate({ schema: createQuizValidator, data: request.all() })

    const quiz = await this.createQuizService.create(payload)
    return response.created(quiz)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    const quiz = await this.getQuizService.get(id)
    return quiz
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })
    const payload = await vine.validate({ schema: updateQuizValidator, data: request.all() })

    const quiz = await this.updateQuizService.update(id, payload)
    return quiz
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const id = await vine.validate({ schema: domainIdValidator, data: params.id })

    await this.deleteQuizService.delete(id)
  }
}
